import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { UserRequest } from '../auth/interfaces';
import { CreatePostDto } from './dto/create-post.dto';
import { QueryPostsDto } from './dto/query-posts.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/posts',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          cb(null, `post-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
          return cb(
            new Error(
              'Seules les images sont autorisées (jpg, jpeg, png, gif, webp)',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
  )
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('Aucun fichier fourni');
    }

    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    return {
      url: `${backendUrl}/uploads/posts/${file.filename}`,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @Request() req: UserRequest) {
    return this.postsService.create(createPostDto, req.user.id);
  }

  @Get()
  findAll(@Query() queryDto: QueryPostsDto) {
    return this.postsService.findAll(queryDto);
  }

  @Get('popular')
  getPopularPosts(@Query('limit') limit?: number) {
    return this.postsService.getPopularPosts(limit);
  }

  @Get('recent')
  getRecentPosts(@Query('limit') limit?: number) {
    return this.postsService.getRecentPosts(limit);
  }

  @Get('author/:authorId')
  findByAuthor(
    @Param('authorId', ParseUUIDPipe) authorId: string,
    @Query() queryDto: QueryPostsDto,
  ) {
    return this.postsService.findByAuthor(authorId, queryDto);
  }

  @Get('my-posts')
  @UseGuards(JwtAuthGuard)
  findMyPosts(@Query() queryDto: QueryPostsDto, @Request() req: UserRequest) {
    return this.postsService.findByAuthor(req.user.id, queryDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Request() req: UserRequest,
  ) {
    return this.postsService.update(id, updatePostDto, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id', ParseUUIDPipe) id: string, @Request() req: UserRequest) {
    return this.postsService.remove(id, req.user.id);
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  likePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: UserRequest,
  ) {
    return this.postsService.likePost(id, req.user.id);
  }

  @Post(':id/unlike')
  @UseGuards(JwtAuthGuard)
  unlikePost(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: UserRequest,
  ) {
    return this.postsService.unlikePost(id, req.user.id);
  }

  @Get(':id/liked')
  @UseGuards(JwtAuthGuard)
  async hasLiked(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: UserRequest,
  ) {
    const hasLiked = await this.postsService.hasUserLikedPost(id, req.user.id);
    return { hasLiked };
  }
}
