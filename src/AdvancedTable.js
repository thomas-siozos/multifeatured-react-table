import React, {useMemo, useRef, useState} from "react";
import {
    flexRender,
    getCoreRowModel, getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable
} from "@tanstack/react-table";
import PropTypes from 'prop-types';
import ModalPortal from "./ModalPortal";
import { FaCog } from 'react-icons/fa';
import { IoIosCloseCircle } from 'react-icons/io';

const AdvancedTable = (props) => {
    const columns = useMemo(() => props.columns, [props.columns]);
    const data = useMemo(() => props.data, [props.data]);
    const [sorting, setSorting] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [selectActive, setSelectActive] = useState(false);
    const [settingsActive, setSettingsActive] = useState(false);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [settingsText, setSettingsText] = useState('');
    const selectParent = useRef();
    const settingsParent = useRef();

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            globalFilter,
            columnVisibility
        },
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        getFilteredRowModel: getFilteredRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel()
    });

    const getContainerCssClass = () => {
        if (props.containerCssClass) return props.containerCssClass;
        return "table-container";
    }

    const getSortingArrowStyles = (id) => {
        let classes = ["sorting-arrow"];
        let findId = sorting.filter(e => e.id === id);
        classes.push(findId.length > 0 && !findId[0].desc ? "sorting-arrow-up" : "sorting-arrow-down");
        if (findId.length === 0) return "sorting-arrow-display-none";
        return classes.join(" ");
    }

    return (
        <div className={getContainerCssClass()}>
            <div className="table-header-container flex-direction-row">
                <div className="table-title">
                    Employees Table
                </div>
                <div className="filters-container">
                    <div className="flex-center search-column-input-container">
                        <input
                            placeholder="Search all columns..."
                            value={globalFilter}
                            type="text"
                            onChange={(e) => {
                                setGlobalFilter(String(e.target.value))
                            }}
                        />
                        <IoIosCloseCircle onClick={() => setGlobalFilter('')} className="delete-button-input"/>
                    </div>
                    <div className='flex-direction-row'>
                        <div className="pagination-button" onClick={() => table.setPageIndex(0)}>
                            {"<<"}
                        </div>
                        <div className="pagination-button" onClick={() => table.previousPage()}>
                            {"<"}
                        </div>
                        <div className="flex-center page-index-input-container">
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
                        <div className="pagination-button" onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
                            {">>"}
                        </div>
                    </div>
                    <div ref={settingsParent} onClick={() => {
                        if (settingsActive) setSelectActive(false);
                        setSettingsActive(!settingsActive)
                    }}>
                        <FaCog id="settings-icon"/>
                    </div>
                    <ModalPortal
                        parent={settingsParent}
                        isOpen={settingsActive}
                        isSettingsModal={true}
                    >
                        <div className="settings-body-container">
                            <div id="settings-search">
                                <input
                                    type="text"
                                    value={settingsText}
                                    placeholder="Search columns..."
                                    onChange={(e) => setSettingsText(e.target.value)}
                                />
                                <IoIosCloseCircle onClick={() => setSettingsText('')} className="delete-button-input"/>
                            </div>
                            <hr/>
                            {table.getAllLeafColumns().filter(e => settingsText !== '' ?
                                e.columnDef.header.toLowerCase().includes(settingsText.toLowerCase()) : e).map(column => {
                                return (
                                    <div key={column.id} className="settings-checkbox-container">
                                        <label>
                                            <input
                                                {...{
                                                    type: 'checkbox',
                                                    checked: column.getIsVisible(),
                                                    onChange: column.getToggleVisibilityHandler(),
                                                }}
                                            />{' '}
                                            {column.columnDef.header}
                                        </label>
                                    </div>
                                )
                            })}
                            <hr/>
                            <div className="flex-center select-container" ref={selectParent} onClick={() => setSelectActive(!selectActive)}>
                                <div className="select-button">
                                    Show {table.getState().pagination.pageSize} of {table.getFilteredRowModel().rows.length}
                                </div>
                                <ModalPortal
                                    parent={selectParent}
                                    isOpen={selectActive}
                                    isSettingsModal={false}
                                    getWidthFromParent={true}
                                >
                                    {[10, 20, 30, 40, 50].map(size => (
                                        <ul key={`select_${size}`}>
                                            <li onClick={() => table.setPageSize(Number(size))}>
                                                Show {size} of {table.getFilteredRowModel().rows.length}
                                            </li>
                                        </ul>
                                    ))}
                                </ModalPortal>
                            </div>
                        </div>
                    </ModalPortal>
                    {/*</div>*/}
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
                                        <div className={getSortingArrowStyles(header.id)}/>
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
