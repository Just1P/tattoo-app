import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Like } from './entities/like.entity';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async create(createPostDto: CreatePostDto, authorId: string): Promise<Post> {
    const post = this.postRepository.create({
      ...createPostDto,
      authorId,
    });

    return await this.postRepository.save(post);
  }

  async findAll(queryDto: QueryPostsDto) {
    const {
      search,
      category,
      authorId,
      status,
      location,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.isPublic = :isPublic', { isPublic: true });

    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('post.category = :category', { category });
    }

    if (authorId) {
      queryBuilder.andWhere('post.authorId = :authorId', { authorId });
    }

    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }

    if (location) {
      queryBuilder.andWhere('post.location ILIKE :location', {
        location: `%${location}%`,
      });
    }

    queryBuilder
      .orderBy(`post.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [posts, total] = await queryBuilder.getManyAndCount();

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post non trouvé');
    }

    return post;
  }

  async findByAuthor(authorId: string, queryDto: QueryPostsDto) {
    const {
      search,
      category,
      status,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = queryDto;

    const queryBuilder = this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.authorId = :authorId', { authorId });

    if (search) {
      queryBuilder.andWhere(
        '(post.title ILIKE :search OR post.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere('post.category = :category', { category });
    }

    if (status) {
      queryBuilder.andWhere('post.status = :status', { status });
    }

    queryBuilder
      .orderBy(`post.${sortBy}`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [posts, total] = await queryBuilder.getManyAndCount();

    return {
      posts,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    userId: string,
  ): Promise<Post> {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas modifier ce post');
    }

    Object.assign(post, updatePostDto);
    return await this.postRepository.save(post);
  }

  async remove(id: string, userId: string): Promise<void> {
    const post = await this.findOne(id);

    if (post.authorId !== userId) {
      throw new ForbiddenException('Vous ne pouvez pas supprimer ce post');
    }

    await this.postRepository.remove(post);
  }

  async likePost(postId: string, userId: string): Promise<Post> {
    const post = await this.findOne(postId);

    // Vérifier si l'utilisateur a déjà liké ce post
    const existingLike = await this.likeRepository.findOne({
      where: { postId, userId },
    });

    if (existingLike) {
      throw new ConflictException('Vous avez déjà liké ce post');
    }

    // Créer le like
    const like = this.likeRepository.create({ postId, userId });
    await this.likeRepository.save(like);

    // Incrémenter le compteur
    post.likesCount += 1;
    return await this.postRepository.save(post);
  }

  async unlikePost(postId: string, userId: string): Promise<Post> {
    const post = await this.findOne(postId);

    // Trouver le like
    const like = await this.likeRepository.findOne({
      where: { postId, userId },
    });

    if (!like) {
      throw new NotFoundException("Vous n'avez pas liké ce post");
    }

    // Supprimer le like
    await this.likeRepository.remove(like);

    // Décrémenter le compteur
    if (post.likesCount > 0) {
      post.likesCount -= 1;
      return await this.postRepository.save(post);
    }

    return post;
  }

  async hasUserLikedPost(postId: string, userId: string): Promise<boolean> {
    const like = await this.likeRepository.findOne({
      where: { postId, userId },
    });
    return !!like;
  }

  async getPopularPosts(limit: number = 10): Promise<Post[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.isPublic = :isPublic', { isPublic: true })
      .orderBy('post.likesCount', 'DESC')
      .addOrderBy('post.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  async getRecentPosts(limit: number = 10): Promise<Post[]> {
    return await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'author')
      .where('post.isPublic = :isPublic', { isPublic: true })
      .orderBy('post.createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }
}
