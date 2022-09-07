import React, {useState} from "react";
import {MOCK_DATA} from "./mockData";
import {
    flexRender,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import PropTypes from 'prop-types';

const columns = [
    {
        id: "employee_id",
        header: "Employee ID",
        accessorKey: "employee_id",
        enableGlobalFilter: false
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
        accessorKey: "salary",
        enableGlobalFilter: false
    }
];

const AdvancedTable = (props) => {
    const [data, setData] = useState(() => [...MOCK_DATA]);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter
        },
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    const getContainerCssClass = () => {
        if (props.containerCssClass) return props.containerCssClass;
        return "table-container";
    }

    const getSrotingArrowStyles = (id) => {
        let classes = ["sorting-arrow"];
        let findId = sorting.filter(e => e.id === id);
        classes.push(findId.length > 0 && !findId[0].desc ? "sorting-arrow-up" : "sorting-arrow-down");
        if (findId.length === 0) return "sorting-arrow-display-none";
        return classes.join(" ");
    }

    return (
        <div className={getContainerCssClass()}>
            <div className="filters-container flex-direction-row">
                <div className="table-title">
                    Employees Table
                </div>
                <div className="search-filter">
                    <input
                        placeholder="Search all columns..."
                        type="text"
                        onChange={(e) => {
                            setGlobalFilter(String(e.target.value))
                        }}
                    />
                </div>
                <div className="pagination-container">
                    <div className="select-container">
                        <select
                            value={table.getState().pagination.pageSize}
                            onChange={e => {
                                table.setPageSize(Number(e.target.value))
                            }}
                        >
                            {[10, 20, 30, 40, 50].map(pageSize => (
                                <option key={pageSize} value={pageSize}>
                                    Show {pageSize} of {table.getFilteredRowModel().rows.length}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="pagination-button" onClick={() => table.previousPage()}>
                        {"<"}
                    </div>
                    <div className="select-container">
                        <input
                            id="page-index-input"
                            type="number"
                            value={table.getState().pagination.pageIndex + 1}
                            onChange={e => {
                                const page = e.target.value ? Number(e.target.value) - 1 : 0
                                table.setPageIndex(page)
                            }}
                        />
                    </div>
                    <div className="pagination-button" onClick={() =>
                        table.getState().pagination.pageIndex < table.getPageCount() - 1 && table.nextPage()}
                    >
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
                                <div
                                    {...{
                                        className: header.column.getCanSort()
                                            ? 'cursor-pointer select-none flex-direction-row'
                                            : 'flex-direction-row',
                                        onClick: header.column.getToggleSortingHandler(),
                                    }}
                                >
                                    {flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                    )}
                                    <div className="sorting-arrow-container">
                                        <div className={getSrotingArrowStyles(header.id)}/>
                                    </div>
                                </div>
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

AdvancedTable.propTypes = {
    containerCssClass: PropTypes.string
}

export default AdvancedTable;
