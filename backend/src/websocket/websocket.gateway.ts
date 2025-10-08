import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
})
export class WebsocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WebsocketGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  afterInit() {
    this.logger.log('WebSocket Gateway initialisé');
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth.token as string;

      if (!token) {
        this.logger.warn(
          `Client ${client.id} rejeté: pas de token d'authentification`,
        );
        client.disconnect();
        return;
      }

      const payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      (client.data as { userId: string; email: string }).userId = payload.sub;
      (client.data as { userId: string; email: string }).email = payload.email;

      await client.join(`user:${payload.sub}`);

      this.logger.log(`Client connecté: ${client.id} (User: ${payload.email})`);
    } catch (error) {
      this.logger.error(
        `Erreur de connexion pour ${client.id}: ${(error as Error).message}`,
      );
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client déconnecté: ${client.id}`);
  }

  emitPostLiked(postId: string, userId: string, likesCount: number) {
    this.server.emit('post:liked', {
      postId,
      userId,
      likesCount,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Post ${postId} liké par ${userId}`);
  }

  emitPostUnliked(postId: string, userId: string, likesCount: number) {
    this.server.emit('post:unliked', {
      postId,
      userId,
      likesCount,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Post ${postId} unliké par ${userId}`);
  }

  emitPostCreated(post: { id: string; [key: string]: unknown }) {
    this.server.emit('post:created', {
      post,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Nouveau post créé: ${post.id}`);
  }

  emitPostUpdated(post: { id: string; [key: string]: unknown }) {
    this.server.emit('post:updated', {
      post,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Post mis à jour: ${post.id}`);
  }

  emitPostDeleted(postId: string) {
    this.server.emit('post:deleted', {
      postId,
      timestamp: new Date().toISOString(),
    });
    this.logger.log(`Post supprimé: ${postId}`);
  }
}
