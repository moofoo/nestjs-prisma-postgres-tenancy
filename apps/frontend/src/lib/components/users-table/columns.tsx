import { MRT_ColumnDef } from 'mantine-react-table';
import { HeaderCell } from './header-cell';
import type { Patient } from 'prismaclient';

export const columns: MRT_ColumnDef<Partial<Patient>>[] = [
    {
        Header: ({ column }) => <HeaderCell header={column.columnDef.header} />,
        accessorKey: 'userName',
        header: 'User Name',
    },
    {
        Header: ({ column }) => <HeaderCell header={column.columnDef.header} />,
        accessorKey: 'isAdmin',
        header: 'Is Admin',
    }
];
