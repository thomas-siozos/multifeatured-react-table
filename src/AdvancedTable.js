import React, {useState} from "react";
import {MOCK_DATA} from "./mockData";
import {flexRender, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";

const columns = [
    {
        id: "employee_id",
        header: "Employee ID",
        accessorKey: "employee_id"
    },
    {
        id: "first_name",
        header: "First Name",
        accessorKey: "first_name"
    },
    {
        id: "last_name",
        header: "Last Name",
        accessorKey: "last_name"
    },
    {
        id: "email",
        header: "Email",
        accessorKey: "email"
    },
    {
        id: "gender",
        header: "Gender",
        accessorKey: "gender"
    },
    {
        id: "job_title",
        header: "Job Title",
        accessorKey: "job_title"
    },
    {
        id: "start_date",
        header: "Starting Date",
        accessorKey: "start_date"
    },
    {
        id: "salary",
        header: "Salary",
        accessorKey: "salary"
    }
];

const AdvancedTable = () => {
    const [data, setData] = useState(() => [...MOCK_DATA]);

    const table = useReactTable({
        data,
        columns,
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    return (
        <div className="table-container">
            <div className="filters-container flex-direction-row">
                <div className="table-title">
                    Employees Table
                </div>
                <div className="pagination-container flex-direction-row">
                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => {
                            table.setPageSize(Number(e.target.value))
                        }}
                    >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                    <div className="pagination-button">
                        {"<"}
                    </div>
                    <div>
                        <input
                            type="number"
                            value={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }}
                        />
                    </div>
                    <div className="pagination-button">
                        {">"}
                    </div>
                </div>
            </div>
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th
                                key={header.id}
                                colSpan={header.colSpan}
                                style={{ position: 'relative', width: header.getSize() }}
                            >
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                                {header.column.getCanResize() && (
                                    <div
                                        onMouseDown={header.getResizeHandler()}
                                        onTouchStart={header.getResizeHandler()}
                                        className={`resizer ${
                                            header.column.getIsResizing() ? 'isResizing' : ''
                                        }`}
                                    ></div>
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                        {row.getVisibleCells().map(cell => (
                            <td key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdvancedTable;
