import { useState } from "react";
import { useFormik } from "formik";
import SweetAlert from '../../Components/SweetAlert'
import { Link, useNavigate } from "react-router-dom";
import { login, secret, setup2FA } from "../../Services/Auth";
import TwoFactorAuth from "./TwoFactorAuth";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const [requires2FA, setRequires2FA] = useState(false);
    const [twoFAInfo, setTwoFAInfo] = useState({ userId: null, qrCode: null, secret: null });
    const [twoFAToken, setTwoFAToken] = useState('');

    const handleShowPassword = () => { showPassword ? setShowPassword(false) : setShowPassword(true); }
    const initialValues = {
        email: '',
        password: ''
    }

    const onSubmit = async (values) => {
        const email = values.email
        try {
            const res = await login(values);
            if (res.data.success) {
                if (res.data.requires2FA) {
                    setRequires2FA(true);
                    setTwoFAInfo({
                        userId: res.data.userId,
                        qrCode: null,
                        secret: null
                    });
                    return;
                } else {
                    const twoFARes = await setup2FA({ email: email });
                    if (twoFARes.data.success) {
                        setRequires2FA(true);
                        setTwoFAInfo({
                            userId:  res.data.userId,
                            qrCode: twoFARes.data.qrCode,
                            secret: twoFARes.data.secret
                        });
                        return;
                    }
                }

                localStorage.setItem('user', JSON.stringify(res.data.data));

                if (res.data.data.role === 'SuperAdmin' || res.data.data.role === 'Admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/items');
                }
            } else {
                SweetAlert.fire(res.data.message, '', 'info');
            }
        } catch (error) {
            SweetAlert.fire(error.message, '', 'info');
        }
    };

    const { values, touched, errors, handleBlur, handleChange, setFieldValue, handleSubmit, setValues, resetForm } = useFormik({
        initialValues: initialValues,
        validationSchema: '',
        onSubmit
    })

    const handleVerify2FA = async () => {
        try {
            const data = {
                id: twoFAInfo.userId,
                token: twoFAToken
            }

            const res = await secret(data);

            if (res.data.success) {
                localStorage.setItem('user', JSON.stringify(res.data.data));
                SweetAlert.fire(res.data.message, '', 'success');
                if (res.data.data.role === 'SuperAdmin' || res.data.data.role === 'Admin') {
                    navigate('/dashboard');
                } else {
                    navigate('/items');
                }
            } else {
                SweetAlert.fire(res.data.message, '', 'error');
            }
        } catch (err) {
            SweetAlert.fire("Verification failed", '', 'error');
        }
    };

    return (
        <section className="login-page py-4 d-flex align-itmes-center justify-content-center flex-column min-vh-100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="login-form">
                            <Link to="/" className="text-center">
                                <img src="./assets/img/logo/logodecorato.png" className="img-fluid" />
                            </Link>
                            <h4>{('Login')}</h4>
                            {!requires2FA ? (
                                <form className="mb-3" onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">{('Email Address')}:</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            placeholder={('name@example.com')}
                                            value={values.email}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </div>
                                    <div className='mb-3'>
                                        <label htmlFor="password" className="form-label">{('Password')}:</label>
                                        <div className="input-group input-group-merge">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                className="form-control"
                                                id="password"
                                                placeholder={('Password')}
                                                value={values.password}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            <span className="cursor-pointer eye-icon input-group-text" onClick={handleShowPassword}>
                                                <i className={showPassword ? "fa-solid fa-eye" : "fa-solid fa-eye-slash"}></i>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <div className="form-check mb-3">
                                            <p className="text-center">
                                                Don't have an account? <Link to="/sign-up">Sign Up</Link>
                                            </p>

                                            {/* <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                {t('Remember me')}
                                            </label> */}
                                        </div>
                                        <Link to="/forgot_password" className="forgot-link mb-3">{('Forgot password')} ?</Link>
                                    </div>
                                    <div className="d-grid text-center">
                                        <button type="Submit" className="login-btn">{('Login')}</button>
                                    </div>
                                </form>
                            ) : (
                                <TwoFactorAuth
                                    twoFAToken={twoFAToken}
                                    setTwoFAToken={setTwoFAToken}
                                    handleVerify2FA={handleVerify2FA}
                                    twoFAInfo={twoFAInfo}
                                />
                            )
                            }

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}