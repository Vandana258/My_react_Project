import { Layout } from "../Layout/Layout";
import { saveAs } from 'file-saver';
import { generatePdf } from "../../Services/Dashboard";
import { Tooltip } from "@mui/material";
import DataTableComp from "../../Components/Datatable"
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { findallItem, updateStatus } from "../../Services/Item";
import SweetAlert from "../../Components/SweetAlert";
import Toast from "../../Components/Toast";
import confirmStatus from "../../Components/SweetAlert"

const DownloadPDF = () => {
// const handleDownload = async () => {
//   try {
//     const res = await generatePdf(); // already includes responseType: 'blob'

//     const pdfBlob = new Blob([res.data], { type: 'application/pdf' });
//     saveAs(pdfBlob, 'downloaded-file.pdf');
//   } catch (error) {
//     console.error('Error downloading PDF:', error);
//     alert('Failed to download PDF.');
//   }
// };

//   return (
//     <Layout>
//         <div>
//         <h2>Download Server-generated PDF</h2>
//         <button onClick={handleDownload}>Download PDF</button>
//         </div>
//     </Layout>
//   );
  const navigate = useNavigate();
    const authUser = localStorage.getItem('user');
    const user = JSON.parse(authUser);
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(0);
    const [popupType, setPopupType] = useState('Add');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [imgBaseUrl, setImgBaseUrl] = useState("");

    useEffect(() => {
        getList();
    }, []);

    const getList = async () => {
        setLoading(true);
        try {
            const response = await findallItem();
            setLoading(false);
            if (response.data.success) {
                setData(response.data.data);
                setImgBaseUrl(response.data.imgBaseUrl);
            } else {
                SweetAlert.error('Error', (response.data.message) || ('An error occurred while fetching item list!'));
            }
        } catch (err) {
            setLoading(false);
            SweetAlert.error('Error', (err.message) || ('Failed to connect to the server. Please try again later.'));
        }
    };

    const handleAdd = () => {
        setEditId(0);
        setPopupType('Add');
        setShow(true);
    }

    const handleEdit = (id) => {
        setEditId(id);
        setPopupType(('Edit'));
        setShow(true);
    }

    const handleStatusChange = (id, action) => {
        const confirmMessage = action === 'active'
            ? ('Are you sure you want to activate?')
            : ('Are you sure you want to deactivate?');

        const btnMsg = (`Yes, ${action} it!`);

        SweetAlert.confirmStatus(confirmMessage, '', btnMsg).then((isConfirmed) => {
            if (isConfirmed) {
                updateStatus({ id, action })
                    .then((res) => {
                        if (res.data.success) {
                            Toast.success((`${action.charAt(0).toUpperCase() + action.slice(1)}d`));
                            getList(); // refresh list
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        SweetAlert.info((error.message), '');
                    });
            } else {
                SweetAlert.info(('Cancelled!'), '', 'info');
            }
        });
    };

    const exportToCSV = (data, filename = "export.csv") => {
        if (!data || data.length === 0) return;

        // Define headers
        const headers = ["Name", "Phone", "Image URL"];

        // Generate rows
        const rows = data.map(item => [
            `"${item.name}"`,
            `"${item.phone}"`,
            `"${item.image}"`
        ]);

        // Combine headers and rows
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

        // Create blob and download
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };



    const columns = [
        {
            name: 'Image',
            selector: row => row?.image,
            cell: row => (
                <Tooltip title={row?.image} placement="top" size="small" arrow>
                    <img
                        src={`${imgBaseUrl}${row?.image}`}
                        alt="item"
                        style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                    />
                </Tooltip>
            ),
            sortable: true,
            minWidth: "200px",
        },
        {
            name: ('Name'),
            selector: row => row?.name,
            cell: row =>
                <Tooltip title={row?.name} placement="top" size='small' arrow>
                    {row?.name}
                </Tooltip>,
            sortable: true,
            minWidth: "200px",
        },
        {
            name: ('Phone'),
            selector: row => row.phone,
            cell: row =>
                <Tooltip title={row.phone} placement="top" size='small' arrow>
                    {row.phone}
                </Tooltip>,
            sortable: true,
            minWidth: "150px",
        },
        {
            name: ('Action'),
            cell: row => (
                <div className="d-flex align-items-center">
                    <>
                        <Tooltip title={("Edit")} placement="top" size='small' arrow>
                            <Link
                                onClick={() => handleEdit(row.id)}
                            >
                                <div className="table-icon bg-success-subtle">
                                    <i className="fa-solid fa-pen-to-square text-success"></i>
                                </div>
                            </Link>
                        </Tooltip>
                        <Tooltip title={("Archive")} placement="top" size='small' arrow>
                            <Link className="ms-2"
                                onClick={() => handleStatusChange(row.id, 'active')}
                            >
                                <div className="table-icon bg-secondary-subtle">
                                    <i className="fa-solid fa-box-archive text-secondary"></i>
                                </div>
                            </Link>
                        </Tooltip>
                    </>
                </div>
            ),
            sortable: true,
        },
    ];

    return (
        <>
            <Layout title={("Items")}>
                <div className="card border-0 mb-3 cardRadius_shadow">
                    <div className="card-body">
                        <div className="d-flex align-items-center justify-content-end flex-wrap">
                            <ul>
                            </ul>
                            <button className="add-btn w-auto small-screen-btn"
                                onClick={handleAdd}
                            >
                                <span>
                                    <i className="fa-solid fa-plus me-2"></i>
                                </span>
                                {("Add Item")}
                            </button>
                            <button className="add-btn w-auto small-screen-btn"
                                onClick={() => exportToCSV(data, "users.csv")}
                            >
                                {("Export as CSV")}
                            </button>
                        </div>
                        <hr />
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <DataTableComp columns={columns} data={data} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </Layout>
        </>
    );

};



export default DownloadPDF;

