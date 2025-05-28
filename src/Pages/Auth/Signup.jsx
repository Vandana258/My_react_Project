import React, { useState } from 'react';
import { useFormik } from 'formik';
import SweetAlert from '../../Components/SweetAlert';
import { useNavigate } from 'react-router-dom';
import { signup } from '../../Services/Auth';

export default function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    
    const onSubmit = async (values) => {
        try {
            const res = await signup(values);
            if (res.data.success) {
                SweetAlert.fire("Signup successful! Please log in.", '', 'success');
                navigate('/login');
            } else {
                SweetAlert.fire(res.data.message, '', 'error');
            }
        } catch (error) {
            SweetAlert.fire("Signup failed", error.message, 'error');
        }
    }

    const { values, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: ''
        },
        validationSchema: '',
        onSubmit
    })

    const toggleShowPassword = () => setShowPassword(!showPassword);

    return (
        <section className="login-page py-4 d-flex align-itmes-center justify-content-center flex-column min-vh-100">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-6">
                        <div className="login-form">
                            <form className="mb-3" onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        className="form-control"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        className="form-control"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password">Password</label>
                                    <div className="input-group input-group-merge">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            className="form-control"
                                            value={values.password}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                        <span className="input-group-text" onClick={toggleShowPassword}>
                                            <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"} />
                                        </span>
                                    </div>
                                </div>

                                 <div className="d-grid text-center">
                                        <button type="Submit" className="login-btn">{('Sign Up')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    );
};
