import React from 'react';
import dayjs from 'dayjs';
import { Center, Box, Stack, Title } from '@mantine/core';
import { MantineReactTable } from 'mantine-react-table';

import type { Patient } from 'prismaclient';
import { useData } from '@/lib/hooks/use-data';
import { columns } from './columns';

export default function PatientsTable() {

    const data = useData<Patient>('patients', (row) => {
        return {
            ...row,
            dob: dayjs(row.dob).format('MM/DD/YYYY') as any
        };
    });

    return (
        <Center>
            <Box sx={{ width: '75%' }}>
                <Stack>
                    <Box>
                        <Title order={3}>Patients</Title>
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
