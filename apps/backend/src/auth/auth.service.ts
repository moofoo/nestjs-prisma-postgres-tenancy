import { Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { UsersService } from '@/models/users/users.service';
import { UserTenantsService } from '@/models/tenant-users/user-tenants.service';
import { compare } from 'bcrypt';
import { Request } from 'express';
import { SessionData } from 'session-opts';

@Injectable()
export class AuthService {

      constructor(private readonly user: UsersService, private readonly userTenant: UserTenantsService) { }

      async login(credentials: { userName: string, password: string; }, req: Request) {

            const { userName, password } = credentials;

            if (!userName || !password) {
                  console.log('Missing username or password', credentials);
                  throw new BadRequestException('Missing username or password');
            }

            const dbUser = await this.user.findFirst({ where: { userName } }, true);

            if (!dbUser) {
                  console.log('Invalid Username or Password 1', credentials);
                  throw new UnauthorizedException('Invalid Username or Password 1');
            }

            const passCheck = await compare(password, dbUser.password);

            if (!passCheck) {
                  console.log('Invalid Username or Password 2', credentials);
                  throw new UnauthorizedException('Invalid Username or Password 2');
            }

            const dbTenants = await this.userTenant.findMany({ where: { userId: dbUser.id } }, true);

            if (!dbTenants || dbTenants?.length === 0) {
                  console.log('Tenant Not Found', credentials);
                  throw new InternalServerErrorException('Tenant Not Found');
            }

            const session: SessionData | any = req?.session || {}; //this.store.get('session');

            session.userId = dbUser.id;
            session.tenantIds = dbTenants.map(tenant => tenant.tenantId);

            session.userName = dbUser.userName;

            session.isAdmin = dbUser.isAdmin;
            session.authenticated = true;

            await session.save();

            return 'ok';
      }

      async logout(req: Request) {
            const session = req.session; //this.store.get('session');

            await session.destroy();

            return 'ok';
      }
}