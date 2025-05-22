export default function TwoFactorAuth({ twoFAToken, setTwoFAToken, handleVerify2FA, twoFAInfo }) {
    return (
        <section className="py-5 d-flex justify-content-center align-items-center flex-column">
            <div className="container">
                <div className="border_radius_left">
                    <div className="row justify-content-center">
                        <div className="col-lg-12 col-md-12 shadow border_radius_right border_radius_left" style={{ background: "#fe5000" }}>
                            <div className="row align-items-center">
                                <div className="col-md-6 px-0">
                                    <div className="py-4 bg-white border_radius_left position-relative overflow-hidden">
                                        <div className="card-body">
                                            <div className="py-4">
                                                <div className="login_header">
                                                    <p className="fw-bold" style={{ color: "#fe5000" }}>Welcome</p>
                                                    <span className="fw-semibold">Verify OTP</span>
                                                </div>
                                                <div className="form-floating mb-5" style={{ margin: "18px" }}>
                                                    <input
                                                        type="password"
                                                        id="otpToken"
                                                        placeholder="OTP Number"
                                                        value={twoFAToken}
                                                        onChange={(e) => setTwoFAToken(e.target.value)}
                                                        name="otpToken"
                                                        className="form-control input-md"
                                                    />
                                                    <label htmlFor="otpToken" className="fs_12">OTP Number</label>
                                                </div>
                                                <div className="text-center mb-3">
                                                    <input
                                                        type="submit"
                                                        onClick={handleVerify2FA}
                                                        className="login_btn w-100 verifyOtpButton"
                                                        value="Verify OTP"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6 px-0 d-md-block d-none text-center text-white">
                                    {twoFAInfo.qrCode ? (
                                        <>
                                            <h1 style={{ fontSize: "16px" }}>Scan QR Code with OTP App</h1>
                                            <p style={{ fontSize: "11px", fontWeight: "600" }}>
                                                Scan the QR code below using your OTP app (e.g., Google Authenticator):
                                            </p>
                                            <img src={twoFAInfo.qrCode} style={{ objectFit: "cover" }} alt="QR Code" />
                                        </>
                                    ) : (
                                        <>
                                            <img src={process.env.REACT_APP_LOGO} style={{ width: 130 }} alt="logo" />
                                            <h3 className="fw-bolder">Verify OTP Token</h3>
                                            <p style={{ fontSize: "13px", fontWeight: "600" }}>
                                                (Verify Using your Google Authenticator Code)
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
