import { Injectable, UnauthorizedException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { UsersService } from '@/models/users/users.service';
import { UserTenantsService } from '@/models/tenant-users/user-tenants.service';
import { compare } from 'bcrypt';
import { Request } from 'express';
import { SessionData } from 'session-opts';
import { TenantsService } from '@/models/tenants/tenants.service';

@Injectable()
export class AuthService {

      constructor(private readonly user: UsersService, private readonly userTenant: UserTenantsService, private readonly tenant: TenantsService) { }

      async login(credentials: { userName: string, password: string; }, req: Request) {

            const { userName, password } = credentials;

            if (!userName || !password) {
                  console.log('Missing username or password', credentials);
                  throw new BadRequestException('Missing username or password');
            }
            const dbUser = await this.user.findFirst({ where: { userName }, include: { UserTenants: { include: { Tenant: { select: { displayName: true } } } }, } }, true);


            if (!dbUser) {
                  console.log('Invalid Username or Password 1', credentials);
                  throw new UnauthorizedException('Invalid Username or Password 1');
            }

            console.log({ dbUser });

            const passCheck = await compare(password, dbUser.password);

            if (!passCheck) {
                  console.log('Invalid Username or Password 2', credentials);
                  throw new UnauthorizedException('Invalid Username or Password 2');
            }



            const dbUserTenants = (dbUser as any).UserTenants;  //why isn't this typed correctly?

            // await this.userTenant.findMany({ where: { userId: dbUser.id, } }, true);

            if (!dbUserTenants || dbUserTenants?.length === 0) {
                  console.log('Tenant Not Found', credentials);
                  throw new InternalServerErrorException('Tenant Not Found');
            }

            const tenantIds = dbUserTenants.map(tenant => tenant.tenantId);


            const dbTenants = await this.tenant.findMany({ where: { id: { in: tenantIds } } });

            const tenantNames = dbUserTenants.reduce((acc, curr) => {
                  return {
                        ...acc,
                        [curr.tenantId]: { value: curr.tenantId, label: curr.Tenant.displayName }
                  };
            }, {});

            console.log({ dbUserTenants, dbTenants, tenantNames });

            const session: SessionData | any = req?.session || {}; //this.store.get('session');

            for (const [k, v] of Object.entries(session)) {
                  if (!['save', 'destroy'].includes(k)) {
                        delete session[k];
                  }
            }

            session.userId = dbUser.id;
            session.userName = dbUser.userName;
            session.isAdmin = dbUser.isAdmin;
            session.tenantIds = tenantIds;
            session.tenantNames = tenantNames;

            if (dbUser.isAdmin) {
                  session.tenantId = 0;
                  session.authenticated = true;

            } else if (session.tenantIds.length === 1) {
                  session.tenantId = session.tenantIds[0];
                  session.authenticated = true;
            }

            await session.save();

            return 'ok';
      }

      async setTenant(credentials: { tenantId: number; }, req: Request) {
            const { tenantId } = credentials;

            const session: SessionData = req.session;

            if (!session || !session?.userId || !session?.tenantIds) {
                  throw new BadRequestException('setTenant function error - Invalid session');
            }

            const { tenantIds } = session;

            if (!tenantIds.includes(tenantId)) {
                  throw new BadRequestException('setTenant function error - Invalid tenant for user');
            }

            session.tenantId = tenantId;
            session.tenantIds = [tenantId];
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