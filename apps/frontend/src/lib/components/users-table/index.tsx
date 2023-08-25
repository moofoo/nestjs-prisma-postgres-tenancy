import React from 'react';

import { Center, Box, Stack, Title } from '@mantine/core';
import { MantineReactTable } from 'mantine-react-table';

import type { User } from 'prismaclient';
import { useData } from '@/lib/hooks/use-data';
import { columns } from './columns';

export default function PatientsTable() {



    const data = useData<User>('users', (row: any) => {
        return {
            ...row,
            isAdmin: `${row.isAdmin}`
        };
    });

    return (
        <Center>
            <Box sx={{ width: '75%' }}>
                <Stack>
                    <Box>
                        <Title order={3}>Users</Title>
                    </Box>

                    <MantineReactTable
                        columns={columns}
                        data={data}
                        enableColumnActions={false}
                        enableColumnFilters={false}
                        enablePagination={false}
                        enableSorting={false}
                        enableBottomToolbar={false}
                        enableTopToolbar={false}
                        mantineTableProps={{
                            highlightOnHover: false,
                            withColumnBorders: true,
                        }}
                        mantineTableContainerProps={{ sx: { border: '1px solid #bfbfbf' } }}
                        mantineTableHeadCellProps={{ align: 'center', bg: 'aliceblue', h: 5 }}
                        mantineTableHeadProps={{ h: 5 }}
                        mantineTableHeadRowProps={{ h: 5 }}
                        initialState={{ density: 'xs' }}
                    />
                </Stack>
            </Box>
        </Center>
    );
}
