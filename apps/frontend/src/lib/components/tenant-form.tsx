import React from 'react';
import {
    Paper,
    Group,
    Button,
    Stack,
    Center,
    Title,
    Box,
} from '@mantine/core';
import { useRouter } from 'next/navigation';
import { useForm } from "react-hook-form";
import {
    PasswordInput,
    TextInput,
    Select
} from "react-hook-form-mantine";

import { getFetchInstance } from '../ofetch-instance';
import { useAppStore } from '../zustand/app-store';
import { TLSSocket } from 'tls';

export function TenantForm(props: { userName: string; tenantNames: any; }) {
    const { tenantNames } = props;
    //
    console.log({ tenantNames });

    const { control, handleSubmit } = useForm({
        defaultValues: {
            tenantId: ''
        }
    });

    const router = useRouter();

    const onSubmitOk = async (data: { tenantId: string; }) => {
        const { setLoading } = useAppStore.getState();
        setLoading(true);

        const oFetch = getFetchInstance();

        let result = null;

        try {
            result = await oFetch('auth/tenant', { method: 'POST', body: { tenantId: Number(data.tenantId) } });
        } catch (err) {
            console.error(err);
        }

        if (!!result) {
            router.push('/');
        }
    };

    return (
        <Center maw={400} pt={25} mx="auto">
            <Stack>
                <Paper radius="md" p="xl" withBorder shadow='md'>
                    <form
                        onSubmit={handleSubmit(
                            (data) => onSubmitOk(data)
                        )}
                    >
                        <Stack>
                            <Select
                                control={control}
                                name='tenantId'
                                data={tenantNames}
                                label="Select Tenant"
                                description="tenant select"
                                withAsterisk
                            />
                        </Stack>

                        <Group position="right" mt="xl">
                            <Button type="submit" radius="xl">
                                Choose Tenant
                            </Button>
                        </Group>
                    </form>
                </Paper>
            </Stack>
        </Center>
    );
}
