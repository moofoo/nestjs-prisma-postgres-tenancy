
import { GetServerSidePropsContext } from 'next';

import { getSessionOpts, SessionData } from 'session-opts';
import { getIronSession } from 'iron-session';
import { TenantForm } from '@/lib/components/tenant-form';

export default function Tenant(props: any) {
      return <TenantForm {...props} />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
      const { req, res } = context;

      const sessionOpts = getSessionOpts();

      const session: SessionData = await getIronSession(req, res, sessionOpts);
      //
      const { userName, tenantNames = {} } = session;

      console.log({ tenantNames });

      return {
            props: { user: { userName }, tenantNames: Object.values(tenantNames) }, // will be passed to the page component as props
      };
}