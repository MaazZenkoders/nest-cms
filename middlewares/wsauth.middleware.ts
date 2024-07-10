import { BadRequestException, Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class WsAuthMiddleware implements NestMiddleware {
  constructor(private readonly authService: AuthService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new NotFoundException('Authorization token is required');
    }
    this.authService.validateToken(token).then(
      (decoded) => {
        req['user'] = decoded;
        next();
      },
      (err) => {
        throw new BadRequestException('Invalid token');
      }
    );
  }
}
