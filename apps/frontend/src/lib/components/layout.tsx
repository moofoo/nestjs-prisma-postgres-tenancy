import React from 'react';
import { AppShell, Header, Group, Button, Title, Box, LoadingOverlay } from '@mantine/core';
import { usePathname, useRouter } from 'next/navigation';
import { shallowEqual } from '@mantine/hooks';

import { useAppStore } from '../zustand/app-store';
import { getFetchInstance } from '../ofetch-instance';

export function Layout(props: { children: React.ReactNode, user: { userName?: string, tenantName?: string; }; }) {
    const { children, user } = props;

    const path = usePathname();
    const router = useRouter();

    const loading = useAppStore(state => {
        return state.loading;
    });

    const storeUser = useAppStore(state => {
        return state.user;
    }, shallowEqual) || user;

    const logout = React.useCallback(async () => {
        const { setLoading } = useAppStore.getState();

        setLoading(true);

        const oFetch = getFetchInstance();

        await oFetch('auth/logout', { method: 'POST' });

        router.push('/login');
    }, []);

    return (
        <>
            <AppShell
                bg='#f3f5f7'
                hidden={path === '/login' ? true : false}
                padding="md"
                header={
                    <Header withBorder height={60} p="xs" bg='lightsteelblue' sx={{ borderBottom: '1px solid black' }}>
                        <Group position='apart' miw={775}>
                            <Title order={2}>Multi Tenant App </Title>
                            <Box>
                                <Group position='right'>
                                    <Title order={5}>Welcome, {storeUser?.userName} of {storeUser?.tenantName}</Title>
                                    <Button onClick={logout}>Logout</Button>
                                </Group>

                            </Box>
                        </Group>
                    </Header>
                }
            >
                <Box pos='relative' bg='#f3f5f7' h={path === '/login' ? '100vh' : undefined}>
                    <LoadingOverlay visible={loading} overlayBlur={1} />
                    {children}
                </Box>
            </AppShell>
        </>
    );
}