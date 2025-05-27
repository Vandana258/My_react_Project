import { Layout } from "../Layout/Layout";
import { Tooltip } from "@mui/material";
import DataTableComp from "../../Components/Datatable"
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Add from "./Add";
import { findallItem } from "../../Services/Item";
import SweetAlert from "../../Components/SweetAlert";

export default function Clients() {
    const navigate = useNavigate();
    const authUser = localStorage.getItem('user');
    const user = JSON.parse(authUser);
    const [show, setShow] = useState(false);
    const [editId, setEditId] = useState(0);
    const [popupType, setPopupType] = useState('Add');
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState([]);
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
                setClients(response.data.data);
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

    // const handleToggleArchive = (id, action) => {
    //     const confirmMessage = action === 'archive'
    //         ? t('Are you sure you want to archive?')
    //         : t('Are you sure you want to unarchive?');

    //     const btnMsg = t(`Yes, ${action} it!`)

    //     SweetAlert.confirmArchive(confirmMessage, '', btnMsg).then((isConfirmed) => {
    //         if (isConfirmed) {
    //             toggleArchiveClient({ id, action }).then((res) => {
    //                 if (res.data.success) {
    //                     Toast.success(t(`${action.charAt(0).toUpperCase() + action.slice(1)}d`));
    //                     setActiveTab('active');
    //                     getList();
    //                 }
    //             }).catch((error) => {
    //                 console.log(error);
    //                 SweetAlert.info(t(error.message), '');
    //             });
    //         } else {
    //             SweetAlert.info(t('Cancelled!'), '', 'info');
    //         }
    //     });
    // };


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
                            // onClick={() => handleToggleArchive(row.id, 'archive')}
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
                        <div className="d-flex align-items-center justify-content-between flex-wrap">
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
                        </div>
                        <hr />
                        <div className="row align-items-center">
                            <div className="col-md-12">
                                <div className="table-responsive">
                                    <DataTableComp columns={columns} data={clients} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Add
                    type={popupType}
                    editId={editId}
                    setEditId={setEditId}
                    show={show}
                    setShow={setShow}
                    loading={loading}
                    setLoading={setLoading}
                    getList={getList}
                />
            </Layout>
        </>
    );
}