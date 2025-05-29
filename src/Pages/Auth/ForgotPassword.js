
import { useFormik } from "formik";
import { forgotpassword } from "../../Services/Auth";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../../Components/Toast";
import SweetAlert from "../../Components/SweetAlert";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const initialValues = {
        email: ''
    }
    
    const onSubmit = async (values) => {
        try {
            const response = await forgotpassword(values);
            if (response.data.success) {
                Toast.success((response.data.message) || ("Password has been sent to your registered mail id!"));
                navigate("/login");
            } else {
                SweetAlert.info((response.data.message) || ("Failed to reset password."), '');
            }
        } catch (err) {
            console.error("Error resetting password:", err);
            SweetAlert.error((err.message) || ('An error occurred'), '');
        }
    }
    
    const { values, touched, errors, handleBlur, handleChange, handleSubmit} = useFormik({
        initialValues: initialValues,
        validationSchema: '',
        enableReinitialize: true,
        onSubmit
    })

    return (
        <section className="login-page py-4 d-flex align-itmes-center justify-content-center flex-column min-vh-100">
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="login-form">
                            <Link to="/" className="text-center">
                                <img src="./assets/img/logo/logodecorato.png" className="img-fluid" />
                            </Link>
                            <h4>{('Reset Your Password')}</h4>
                            <p className="sub-title">{('Please enter your email address. You will receive a link to create a new password via email.')}</p>
                            <form className="mb-3" onSubmit={handleSubmit} method="POST">
                                <div className="mb-3">
                                    <label htmlFor="email-address" className="form-label">{('Email Address')}:</label>
                                    <input type="email" className="form-control" id="email-address" placeholder={('name@example.com')}
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {touched.email && errors.email && (
                                        <div className="text-danger errorMSG">{errors.email}</div>
                                    )}
                                </div>
                                <div className="d-grid text-center">
                                    <button type="Submit" className="login-btn">{('Send')}</button>
                                </div>
                            </form>
                            <p>{('Remember your password')} ? <Link to="/login" className="forgot-link">{('Sign in')}</Link></p>
                        </div>
                        {/* <div className="creater-panel-details">
                            <p className="mb-0">{('Designed by')} <Link className="forgot-link"
                                to="https://actiknow.com/" target="_blank">Actiknow</Link>.</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </section>
    );
}