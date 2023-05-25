export function HeaderCell(props: { header: string, color?: string; }) {
    let { header, color } = props;
    color = color || 'black';
    return <span style={{ color }}>{header}</span>;
};