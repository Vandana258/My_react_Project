import DataTable from 'react-data-table-component';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import SearchIcon from '@mui/icons-material/Search';
import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";

const customStyles = {
    rows: {
        style: {
            minHeight: '40px',
            highlightOnHoverStyle: {
                backgroundColor: 'rgb(230, 244, 244)',
                borderBottomColor: '#FFFFFF',
                borderRadius: '25px',
                outline: '1px solid #FFFFFF',
            },
        },
    },
    headCells: {
        style: {
            height: '40px',
            paddingLeft: '8px',
            paddingRight: '8px',
            color: '#202124',
            fontSize: '14px',
            fontWeight: 600,
        },
        grow: 2,
    },
    cells: {
        style: {},
    },
};

export const DataTableComp = ({ columns, data, ...rest }) => {
    const [search, setSearch] = useState('');
    const [filteredData, setFilteredData] = useState(data);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const paginationComponentOptions = {
        rowsPerPageText: ('Rows per page'),
        rangeSeparatorText: ('of'),
        selectAllRowsItem: true,
        selectAllRowsItemText: ('All'),
    };

    useEffect(() => {
        setFilteredData(data);
    }, [data]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearch(value);

        const filtered = data.filter(row => {
            return columns.some(column => {
                let columnValue = '';

                if (typeof column.selector === 'function') {
                    columnValue = column.selector(row);
                } else if (typeof column.selector === 'string') {
                    columnValue = row[column.selector];
                } else if (column.cell && typeof column.cell === 'function') {
                    const cellContent = column.cell(row);
                    if (React.isValidElement(cellContent)) {
                        columnValue = cellContent.props.children ? cellContent.props.children.toString() : '';
                    } else {
                        columnValue = cellContent ? cellContent.toString() : '';
                    }
                }

                // Log each column and its value for debugging
                // console.log(`Row ID: ${row.id}, Column Selector: ${column.selector}, Column Value: ${columnValue}`);

                if (columnValue && typeof columnValue === 'string') {
                    return columnValue.toLowerCase().includes(value);
                }
                return false;
            });
        });

        setFilteredData(filtered);
    };
    
    const subHeaderComponent = (
        <div style={{ position: 'relative', width: '300px' }}>
            <input
                type="text"
                placeholder="Search"
                value={search}
                onChange={handleSearch}
                className="form-control form-control-sm"
                style={{ paddingLeft: '40px', width: '100%' }} // Padding left for the icon space
            />
            <SearchIcon
                style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#6c757d'
                }}
            />
        </div>
    );

    const updatedColumns = [
        {
            name: ('S No.'),
            selector: (_, index) => index + 1 + (currentPage - 1) * rowsPerPage,
            sortable: false,
            width: '50px',
        },
        ...columns,
    ];

    const noDataComponent = <div>{("There are no records to display")}</div>;
    return (
        <DataTable
            noDataComponent={noDataComponent}
            pagination
            paginationPerPage={rowsPerPage} // Default rows per page
            paginationRowsPerPageOptions={[10, 20, 50, 100]} // Page size options
            onChangePage={setCurrentPage}
            onChangeRowsPerPage={(currentRowsPerPage, currentPage) => {
                setRowsPerPage(currentRowsPerPage);
                setCurrentPage(currentPage);
            }}
            columns={updatedColumns}
            customStyles={customStyles}
            sortIcon={<ArrowDropUpIcon />}
            data={filteredData}
            paginationComponentOptions={paginationComponentOptions}
            keyField="id" 
            // subHeader
            // subHeaderComponent={subHeaderComponent}
            {...rest}
        />
    );
}

export default DataTableComp;

DataTableComp.propTypes = {
    columns: PropTypes.array.isRequired,
    data: PropTypes.array.isRequired
};
