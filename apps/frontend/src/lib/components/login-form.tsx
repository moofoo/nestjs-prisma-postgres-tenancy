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
} from "react-hook-form-mantine";

import { getFetchInstance } from '../ofetch-instance';
import { useAppStore } from '../zustand/app-store';

export function LoginForm() {

    const { control, handleSubmit } = useForm({
        defaultValues: {
            userName: '',
            password: ''
        }
    });

    const router = useRouter();

    const onSubmitOk = async (data: { userName: string, password: string; }) => {
        const { setLoading } = useAppStore.getState();
        setLoading(true);

        const oFetch = getFetchInstance();

        let result = null;

        try {
            result = await oFetch('auth/login', { method: 'POST', body: data });
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
                            <TextInput required name="userName" control={control} label="Username" radius="md" />
                            <PasswordInput
                                name="password"
                                control={control}
                                label="Password"
                                required
                                placeholder="Your password"
                                radius="md"
                            />
                        </Stack>

                        <Group position="right" mt="xl">
                            <Button type="submit" radius="xl">
                                Login
                            </Button>
                        </Group>
                    </form>
                </Paper>

                <Stack ml={25}>
                    <Group><Title order={6}>5 non-admin tenants with 2 users each (password: user)</Title> </Group>
                    <Group><Title order={6}>1 admin tenant with a single user (password: admin)</Title> </Group>
                    <Group><Title order={6}>Username format (non-admin): t(1-5) user(1-2)</Title> </Group>
                    <Group><Title order={6}>Example (tenant 3 user 2): <i>t3 user2</i>, password <i>user</i></Title> </Group>
                    <Group><Title order={6}>Example (tenant 1 user 1): <i>t1 user1</i>, password <i>user</i></Title> </Group>
                    <Group><Title order={6}>Admin login: <i>t6 admin</i>, password <i>admin</i></Title> </Group>
                </Stack>

            </Stack>
        </Center>
    );
}
