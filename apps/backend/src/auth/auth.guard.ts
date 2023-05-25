import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request, Response } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { ClsService } from 'nestjs-cls';
@Injectable()
export class AuthGuard implements CanActivate {
      constructor(private readonly reflector: Reflector, private readonly store: ClsService) { }

      public async canActivate(context: ExecutionContext): Promise<boolean> {

            const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
                  context.getHandler(),
                  context.getClass(),
            ]);

            if (context.getType() === 'http' || context.getType() === 'ws') {
                  const switched = context.switchToHttp();

                  return await this.setHttpHeader(
                        isPublic,
                        switched.getRequest(),
                        switched.getResponse(),
                        context.getType()
                  );
            }
      }

      private async setHttpHeader(
            isPublic: boolean,
            _req: Request,
            _res: Response,
            _type = 'http'
      ): Promise<boolean> {

            if (isPublic === true) {
                  return true;
            }

            const session = this.store.get('session');

            return !!session.authenticated;
      }

}