import { useFormik } from "formik";
import Toast from "../../Components/Toast";
import { Link } from "react-router-dom";
import { Layout } from '../Layout/Layout';
import SweetAlert from "../../Components/SweetAlert";
import { useEffect, useRef, useState } from "react";
import { updateProfile } from "../../Services/AccountSettings";

export default function Profile() {
    const [imgSrc, setImgSrc] = useState('assets/img/avatar-placeholder.png')
    const authUser = localStorage.getItem('user');
    const user = JSON.parse(authUser);
    const inputFile = useRef(null);

    const onFileChange = (file) => {
        formik.setFieldValue('image', file);
        const reader = new FileReader();
        reader.onload = () => {
            setImgSrc(reader.result);
        }
        reader.readAsDataURL(file);
    };

    const resetImage = () => {
        if (inputFile.current) {
            inputFile.current.value = "";
            inputFile.current.type = "text";
            inputFile.current.type = "file";
        }
        setImgSrc('assets/img/avatar-placeholder.png');
        formik.setFieldValue('image', '');
    };

    useEffect(() => {
        setImgSrc(imgSrc)
    }, [imgSrc]);

    const initialValues = {
        id: user.id,
        name: user.name,
        lastName: user.lastName || '',
        email: user.email,
        country: user.country,
        phone: user.phone,
        address1: user.address1,
        state: user.state,
        // zipcode: user.zipcode,
        country: user.country,
        image: '',
    }

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: '',
        onSubmit: values => {
            handleSubmit(values);
        }
    });

    useEffect(() => {
        if (Object.keys(user).length !== 0) {
            setImgSrc(user.image ? user.image : 'assets/img/avatar-placeholder.png');
            formik.setValues({
                id: user.id,
                name: user.name,
                lastName: user.lastName || '',
                email: user.email,
                phone: user.phone ? user.phone : '',
                address1: user.address1 ? user.address1 : '',
                state: user.state ? user.state : '',
                // zipcode: user.zipcode ? user.zipcode : '',
                country: user.country ? user.country : '',
                image: '',
            });
        }
    }, [formik.setValues]);

    const handleSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('id', values.id);
            formData.append('name', values.name);
            formData.append('lastName', values.lastName);
            formData.append('email', values.email);
            formData.append('phone', values.phone);
            formData.append('address1', values.address1);
            formData.append('state', values.state);
            // formData.append('zipcode', values.zipcode);
            formData.append('country', values.country);

            if (values.image !== '') { // Adjust this condition based on your backend handling
                formData.append('image', values.image);
            } else {
                setImgSrc('assets/img/avatar-placeholder.png')
                formData.append('image', imgSrc);
            }

            let res = await updateProfile(formData);
            if (res.data.success) {
                const authUserJSON = localStorage.getItem('user');
                let authUser = JSON.parse(authUserJSON);

                if (authUser) {
                    if (values.image) {
                        authUser.image = `${res.data.imgBaseUrl}${res.data.data.image}`;
                    } else {
                        authUser.image = imgSrc;
                    }
                    authUser.name = res.data.data.name;
                    authUser.lastName = res.data.data.lastName;
                    authUser.email = res.data.data.email;
                    authUser.phone = res.data.data.phone;
                    authUser.address1 = res.data.data.address1;
                    authUser.state = res.data.data.state;
                    // authUser.zipcode = res.data.data.zipcode;
                    authUser.country = res.data.data.country;

                    try {
                        localStorage.setItem('user', JSON.stringify(authUser));
                    } catch (error) {
                        console.error("Error storing authUser:", error);
                    }
                } else {
                    console.error("authUserJSON is not valid JSON:", authUserJSON);
                }
                Toast.success((res.data.message));
                window.location.reload();
            } else {
                SweetAlert.fire((res.data.message), '');
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                SweetAlert.error(('Error updating profile:') + (error.response.data.message), '');
            } else {
                SweetAlert.error(('Error updating profile:') + (error.message), '');
            }
        }
    };


    return (
        <Layout title={("Edit Profile")}>
            <div className="row">
                <div className="col-md-12">
                    <form id="formAccountSettings" method="POST" onSubmit={formik.handleSubmit} encType="multipart/form-data">
                        <div className="card mb-3 border-0 cardRadius_shadow">                        
                            <div className="card-body">
                                <ul className="nav nav-tabs ss-nav-tabs mb-3">
                                    <li className="nav-item">
                                        <a className="nav-link active">
                                            {/* <i className="fa-regular fa-user me-1"></i> */}
                                            {('Profile Details')}</a>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/change-password">
                                        {/* <i className="fa fa-key me-1"></i>  */}
                                        {('Change Password')}</Link>
                                    </li>
                                </ul>
                                <div className="d-flex align-items-start align-items-sm-center gap-4">
                                   {/* <img 
                                        src={
                                            formik.values.image && typeof formik.values.image === "object"
                                            ? URL.createObjectURL(formik.values.image)
                                            : formik.values.image
                                        } 
                                        alt="user-avatar"
                                        className="d-block rounded" height="100" width="100" id="uploadedAvatar"
                                    /> */}
                                    <img src={imgSrc} alt="user-avatar" className="d-block rounded" height="100" width="100" id="uploadedAvatar" />
                                    <div className="button-wrapper">
                                        <label htmlFor="upload" className="login-btn text-white me-2 mb-2" tabIndex="0" style={{ cursor: 'pointer' }}>
                                            <span className="d-none d-sm-block">{('Upload new photo')}</span>
                                            <i className="fa-solid fa-arrow-up-from-bracket d-block d-sm-none"></i>
                                            <input type="file" id="upload" className="account-file-input" hidden accept="image/png, image/jpeg" name='image' onChange={(e) => onFileChange(e.target.files[0])} ref={inputFile} />
                                        </label>
                                        <button type="button" className="add-btn account-image-reset mb-2" onClick={resetImage}>
                                            <i className="fa-solid fa-arrow-rotate-left d-block d-sm-none"></i>
                                            <span className="d-none d-sm-block">{('Reset')}</span>
                                        </button>

                                        <p className="text-muted mb-0 fw-semibold" style={{ fontSize: "11px" }}>{('Allowed JPG, GIF or PNG. Max size of 800K')} </p>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-0" />
                            <div className="card-body">
                                <div className="row">
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="name" className="form-label">{('Name')}</label>
                                        <input className="form-control" type="text" id="name" name="name"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.name}
                                            placeholder={("Enter your firstname")} autoFocus />
                                        {formik.touched.name && formik.errors.name && (
                                            <div className="text-danger errorMSG">{formik.errors.name}</div>
                                        )}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="surname" className="form-label">{('Surname')}</label>
                                        <input className="form-control" type="text" id="lastName" name="lastName"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.lastName}
                                            placeholder={("Enter your surname")} autoFocus />
                                        {formik.touched.lastName && formik.errors.lastName && (
                                            <div className="text-danger errorMSG">{formik.errors.lastName}</div>
                                        )}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="email" className="form-label">{('Email')}</label>
                                        <input className="form-control" type="email" id="email" name="email"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.email}
                                            placeholder={("Enter your email")} />
                                        {formik.touched.email && formik.errors.email && (
                                            <div className="text-danger errorMSG">{formik.errors.email}</div>
                                        )}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label className="form-label" htmlFor="phoneNumber">{('Telephone')}</label>
                                        <input className="form-control" type="text" id="phone" name="phone"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.phone}
                                            placeholder={("Enter your phone number")} />
                                        {formik.touched.phone && formik.errors.phone && (
                                            <div className="text-danger errorMSG">{formik.errors.phone}</div>
                                        )}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="address" className="form-label">{('Address')}</label>
                                        <input type="text" className="form-control" id="address" name="address1"
                                            placeholder={("Enter your address")}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.address1} />
                                        {formik.touched.address1 && formik.errors.address1 && (
                                            <div className="text-danger errorMSG">{formik.errors.address1}</div>
                                        )}
                                    </div>
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="state" className="form-label">{('State')}</label>
                                        <input className="form-control" type="text" id="state" name="state"
                                            placeholder={("Enter your state")}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.state} />
                                        {formik.touched.state && formik.errors.state && (
                                            <div className="text-danger errorMSG">{formik.errors.state}</div>
                                        )}
                                    </div>
                                    {/* <div className="mb-3 col-md-6">
                                        <label htmlFor="zipCode" className="form-label">{("Zip Code")}</label>
                                        <input type="text" className="form-control" id="zipCode" name="zipcode"
                                            placeholder={("Enter your zipcode")} // maxlength="6"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.zipcode} />
                                        {formik.touched.zipcode && formik.errors.zipcode && (
                                            <div className="text-danger errorMSG">{formik.errors.zipcode}</div>
                                        )}
                                    </div> */}
                                    <div className="mb-3 col-md-6">
                                        <label htmlFor="country" className="form-label">{('Country')}</label>
                                        <input type="text" className="form-control" id="country" name="country"
                                            placeholder={("Enter your country")}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.country} />
                                        {formik.touched.country && formik.errors.country && (
                                            <div className="text-danger errorMSG">{formik.errors.country}</div>
                                        )}
                                    </div>
                                    <div className="mt-2">
                                        <button type="submit" className="login-btn me-2">{('Save changes')}</button>
                                        {/* <button type="reset" className="add-btn">{t('Cancel')}</button> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout >
    );
}