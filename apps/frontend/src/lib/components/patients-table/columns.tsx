import { MRT_ColumnDef } from 'mantine-react-table';
import { HeaderCell } from './header-cell';
import type { Patient } from 'app-prisma';

export const columns: MRT_ColumnDef<Partial<Patient>>[] = [
    {
        Header: ({ column }) => <HeaderCell header={column.columnDef.header} />,
        accessorKey: 'firstName',
        header: 'First Name',
    },
    {
        Header: ({ column }) => <HeaderCell header={column.columnDef.header} />,
        accessorKey: 'lastName',
        header: 'Last Name',
    },
    {
        Header: ({ column }) => <HeaderCell header={column.columnDef.header} />,
        accessorKey: 'dob',
        header: 'Date of Birth',
    }
];
