
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate();
    const authUser = localStorage.getItem('user');
    const user = JSON.parse(authUser);

    const goBack = () => {
        // navigate(-1);
        if(user?.role === "SuperAdmin" || user?.role === "Admin"){
            navigate('/dashboard');
        }else{
            navigate('/');
        }
        
    };

    return (
        <div className="unauthorized-container">
            <div className="messageContainer">
                <h1 className="title">{('Unauthorized')}</h1>
                <p className="message mb-0">{('You do not have permission to view this page.')}</p>
                {/* <div className="text-end"> */}
                    <button className="go-back-button" onClick={goBack}>
                        {('Go back to home')}
                    </button>
                {/* </div> */}
            </div>
        </div>
    );
};

export default Unauthorized;