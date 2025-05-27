import { useState } from "react";
import { useFormik } from 'formik';
import SweetAlert from "../../Components/SweetAlert";
import Toast from "../../Components/Toast";
import { Link } from "react-router-dom";
import { Layout } from '../Layout/Layout';
import { changePassword, checkCurrentPassword } from '../../Services/AccountSettings';
import { changePasswordValidationSchema } from "../../utils/validationSchemas";

export default function ChangePassword() {
    const authUser = localStorage.getItem('user');
    const user = JSON.parse(authUser);
    const [values, setValues] = useState({
        password: '',
        currentPassword: '',
        showNewPassword: false,
        confirmNewPassword: '',
        showCurrentPassword: false,
        showConfirmNewPassword: false
    })
    
    const handleCheckCurrentPassword = async (password) => {
        let data = {}
        let userData = localStorage.getItem('user');
        userData = JSON.parse(userData);
        if (password) {
            data.id = userData.id;
            data.password = password;
            let response = await checkCurrentPassword(data);
            let result = response.data;
            if (result.success && result.exists === true) {
                return true
            }
            else {
                return false
            }
        }
        else {
            return false
        }
    }

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            password: '',
            confirmNewPassword: '',
        },
        validationSchema: changePasswordValidationSchema(handleCheckCurrentPassword),
        onSubmit: values => {
            handleSubmit(values);
            formik.resetForm();
        }
    });

    const handleSubmit = async (values) => {
        try {
            let res = await changePassword(values);
            if (res.data.success) {
                Toast.success((res.data.message));
            }
            else {
                SweetAlert.fire((res.data.message), '');
            }
        } catch (error) {
            SweetAlert.error(('Failed to update password') + (error.message), '');
        }
    }

    const handleClickShowCurrentPassword = () => {
        setValues({ ...values, showCurrentPassword: !values.showCurrentPassword })
    }

    const handleClickShowNewPassword = () => {
        setValues({ ...values, showNewPassword: !values.showNewPassword })
    }

    const handleClickShowConfirmNewPassword = () => {
        setValues({ ...values, showConfirmNewPassword: !values.showConfirmNewPassword })
    }

    return (
        <Layout title={('Edit Profile')}>
            <div className="row" style={{ alignItems: 'center', justifyContent: 'center' }}>
                <div className="col-md-12">
                    <div className="card mb-4 border-0 cardRadius_shadow">
                        <div className="card-body">
                            <ul className="nav nav-tabs ss-nav-tabs flex-sm-column flex-md-row mb-3">
                                <li className="nav-item">
                                    <Link className="nav-link" to="/profile">
                                    {/* <i className="fa fa-user me-1"></i>  */}
                                    {('Profile Details')}</Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link active" to="#;">
                                    {/* <i className="fa fa-key bx bx bxs-key me-1"></i> */}
                                     {('Change Password')}</Link>
                                </li>
                            </ul>
                            <form id="formAccountSettings" method="POST" onSubmit={formik.handleSubmit} >
                                <div className="row">
                                    <div className="mb-3 col-md-6 form-password-toggle">
                                        <div className="d-flex justify-content-between">
                                            <label className="form-label" htmlFor="password">{('Old Password')}</label>
                                        </div>
                                        <div className="input-group input-group-merge">
                                            <input type={values.showCurrentPassword ? "text" : "password"} id="oldPassword" className="form-control border-right" name="oldPassword" placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" aria-describedby="password" value={formik.values.oldPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            <span className="input-group-text cursor-pointer" onClick={handleClickShowCurrentPassword}><i className={values.showCurrentPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                                        </div>

                                        {formik.touched.oldPassword && formik.errors.oldPassword && (
                                            <div className="text-danger errorMSG">{formik.errors.oldPassword}</div>
                                        )}
                                    </div>

                                    <div className="mb-3 col-md-6 form-password-toggle">
                                        <div className="d-flex justify-content-between">
                                            <label className="form-label" htmlFor="password">{('New Password')}</label>
                                        </div>
                                        <div className="input-group input-group-merge">
                                            <input type={values.showNewPassword ? 'text' : 'password'} id="password" className="form-control border-right" name="password" placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" aria-describedby="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            <span className="input-group-text cursor-pointer" onClick={handleClickShowNewPassword}><i className={values.showNewPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                                        </div>

                                        {formik.touched.password && formik.errors.password && (
                                            <div className="text-danger errorMSG">{formik.errors.password}</div>
                                        )}
                                    </div>

                                    <div className="mb-3 form-password-toggle">
                                        <div className="d-flex justify-content-between">
                                            <label className="form-label" htmlFor="password">{('Re Enter New Password')}</label>
                                        </div>
                                        <div className="input-group input-group-merge">
                                            <input type={values.showConfirmNewPassword ? 'text' : 'password'} id="confirmNewPassword" className="form-control border-right" name="confirmNewPassword" placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;" aria-describedby="password" value={formik.values.confirmNewPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                                            <span className="input-group-text cursor-pointer" onClick={handleClickShowConfirmNewPassword}><i className={values.showConfirmNewPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i></span>
                                        </div>

                                        {formik.touched.confirmNewPassword && formik.errors.confirmNewPassword && (
                                            <div className="text-danger errorMSG">{formik.errors.confirmNewPassword}</div>
                                        )}
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <button type="submit" className="login-btn me-2">{('Save changes')}</button>
                                    {/* <button type="reset" className="btn btn-outline-secondary">Cancel</button> */}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    )
}