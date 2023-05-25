import React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { usePathname, useSearchParams } from 'next/navigation';
import { MantineProvider } from '@mantine/core';
import { useDidUpdate, useShallowEffect } from '@mantine/hooks';

import { useAppStore } from '@/lib/zustand/app-store';
import { Layout } from '@/lib/components/layout';

export default function App(props: AppProps) {
  const { Component, pageProps } = props;

  const { user } = pageProps;

  const pathname = usePathname();
  const searchParams = useSearchParams();

  useShallowEffect(() => {
    if (pathname === '/login') {
      localStorage.removeItem('app-store-storage');
    } else {
      const { setUser, user: storeUser } = useAppStore.getState();
      if (!!user && storeUser?.userName !== user?.userName) {
        setUser(user);
      }
    }
  }, [user, pathname]);

  useDidUpdate(() => {
    setTimeout(() => {
      const { setLoading } = useAppStore.getState();
      setLoading(false);
    });

  }, [pathname, searchParams]);


  return (
    <>
      <Head>
        <title>Multi Tenancy Example App</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: 'light',
        }}
      >
        <Layout {...pageProps}><Component {...pageProps} /></Layout>
      </MantineProvider>
    </>
  );
}