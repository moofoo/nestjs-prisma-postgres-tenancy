import React from 'react';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';

import { getSessionOpts, SessionData } from 'session-opts';
import { getIronSession } from 'iron-session';

const PatientsTable = dynamic(() => import('@/lib/components/patients-table'), {
  loading: () => <p>Loading...</p>,
});

export default function Home() {
  return <PatientsTable />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req, res } = context;

  const sessionOpts = getSessionOpts();

  const session: SessionData = await getIronSession(req, res, sessionOpts);

  const { userName, tenantName } = session;


  return {
    props: { user: { userName, tenantName } }, // will be passed to the page component as props
  };
}
