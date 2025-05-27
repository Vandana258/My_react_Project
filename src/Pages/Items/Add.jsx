import { useEffect } from 'react';
import { useFormik } from 'formik';
import PopupModal from '../../Components/PopupModal';
import Toast from "../../Components/Toast";
import SweetAlert from "../../Components/SweetAlert"
import FormDropDown from '../../Components/FormDropdown'
import { roles } from '../../utils/common';
import { createItem, findoneItem, updateItem } from '../../Services/Item';
export default function Add({ type, editId, setEditId, show, setShow, loading, setLoading, getList, ...rest }) {

    const handleClose = () => { setShow(false);};

    const dropDownChange = (e) => {
        const { name, value } = e.target;
        setFieldValue(name, value);
    }

    const handleFileChange = (file) => {
        setFieldValue("image", file);
    };

    const onSubmit = async (values, { resetForm }) => {
        console.log("values",values)
        const formData = new FormData();
        if (values.id !== undefined) {
            formData.append('id', values.id);
        }
        formData.append('name', values.name);
        formData.append('phone', values.phone);
        if (Array.isArray(values.role)) {
            formData.append('role', values.role.join(','));
        } else {
            formData.append('role', values.role);
        }
        if (values.image) {
            formData.append('image', values.image);
        }
        const apiCall = editId > 0 ? updateItem : createItem;
        apiCall(formData).then(res => {
            setLoading(false);
            setShow(false);
            if (res.data.success) {
                Toast.success((res.data.message) || 'Data saved successfully');
                getList();
                resetForm();
            } else {
                SweetAlert.error((res.data.message), '');
            }
        })
            .catch((error) => {
                setLoading(false);
                setShow(false);
                SweetAlert.error((error.message) || 'An error occurred', '');
            });
    }

    const title = `${type === 'Add' ? 'Add' : 'Edit'} Client`;

    const initialValues = {
        name: '',
        phone: '',
        role: '',
        image: ''
    };

    if (editId) {
        initialValues.id = editId;
    }


    const { values, touched, errors, handleBlur, handleChange, setFieldValue, handleSubmit, setValues, resetForm } = useFormik({
        initialValues: initialValues,
        validationSchema: '',
        onSubmit
    })

    useEffect(() => {
        if (editId > 0) {
            findoneItem({ id: editId }).then(res => {
                if (res.data.success) {
                    setValues({
                        id: res?.data?.data?.id,
                        name: res?.data?.data?.name,
                        phone: res?.data?.data?.phone,
                        role: res?.data?.data?.role,
                        image: res?.data?.imageUrl
                    });
                }
            });
        }
        else {
            resetForm();
        }
    }, [show]);

    return (
        <PopupModal open={show} setOpen={handleClose} title={title} handleSubmit={handleSubmit} size="lg">
            <div className="row align-items-center">
                <div className="col-md-6">
                    <div className="mb-2">
                        <label htmlFor="name" className="form-label">{("Name")}</label>
                        <input type="text" className="form-control" id="name" name="name" placeholder={("Name")}
                            value={values.name}
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        {touched.name && errors.name && (
                            <div className="text-danger errorMSG">{errors.name}</div>
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-2">
                        <label className="form-label">{("Role")}</label>
                        <FormDropDown
                            onChange={dropDownChange}
                            name="role"
                            options={roles}
                            value={values.role}
                            classnm="fs-13 mb-3 form-control length_count"
                        />
                        {/* {touched.category && errors.category && (
                        <div className="text-danger errorMSG">{errors.category}</div>
                    )} */}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-2">
                        <label htmlFor="phone" className="form-label">{("Phone")}</label>
                        <input type="text" className="form-control" id="phone" name="phone" placeholder={("Phone")}
                            value={values.phone}
                            onChange={handleChange}
                            onBlur={handleBlur} />
                        {/* {touched.phone && errors.phone && (
                            <div className="text-danger errorMSG">{errors.phone}</div>
                        )} */}
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="mb-2">
                        <label className="form-label">{("Image")}</label>
                        <input type="file" className="form-control" id="image" name="image" onChange={(e) => handleFileChange(e.target.files[0])}
                        />
                        <span style={{ fontSize: "9px" }}>*(preferred image size 650×350)</span>
                        {/* {touched.phone && errors.phone && (
                            <div className="text-danger errorMSG">{errors.phone}</div>
                        )}  */}
                        <div className="col-md-4">
                            <img
                                src={
                                    values.image
                                        ? typeof values.image === 'string'
                                            ? values.image
                                            : URL.createObjectURL(values.image)  // it's a File
                                        : ''
                                }
                                alt=""
                                style={{ width: "90px" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PopupModal>
    );
}