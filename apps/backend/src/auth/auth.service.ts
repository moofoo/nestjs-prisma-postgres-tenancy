import { Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { UsersService } from '@/models/users/users.service';
import { TenantsService } from '@/models/tenants/tenants.service';
import { compare } from 'bcrypt';
import { SessionData } from 'session-opts';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class AuthService {

      constructor(private readonly user: UsersService, private readonly tenant: TenantsService, private readonly store: ClsService) { }

      async login(credentials: { userName: string, password: string; }) {

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

            const dbTenant = await this.tenant.findUnique({ where: { id: dbUser.tenantId } }, true);

            if (!dbTenant) {
                  console.log('Tenant Not Found', credentials);
                  throw new InternalServerErrorException('Tenant Not Found');
            }

            const session: SessionData = this.store.get('session');

            session.userId = dbUser.id;
            session.tenantId = dbUser.tenantId;

            session.userName = dbUser.userName;
            session.tenantName = dbTenant.displayName;

            session.isAdmin = dbTenant.isAdmin;
            session.authenticated = true;

            await session.save();

            return 'ok';
      }

      async logout() {
            const session = this.store.get('session');

            await session.destroy();

            return 'ok';
      }
}