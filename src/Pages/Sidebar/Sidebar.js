import { Link, useLocation } from "react-router-dom";

export default function Sidebar({ toggleSidebar }) {
    const location = useLocation();
    const authUser = localStorage.getItem('user');
    const user = JSON.parse(authUser);

    const removeToggleSidebarClass = () => {
        document.querySelector('body').classList.remove('toggle-sidebar');
    }

    return (
        <section id="sidebar" className="sidebar">
            <Link className="navbar-brand" to="/">
                <img src={process.env.REACT_APP_BASE_URL + "assets/img/logo/white-logo.png"} className="img-fluid" />
            </Link>
            <span className="toggle-sidebar-btn2 cursor-pointer d-xl-none d-sm-block" onClick={toggleSidebar}><i className="fa-solid fa-bars-staggered"></i></span>
            <ul id="sidebar-nav" className="sidebar-nav scroll">
                {user && user.role && (
                    <>
                        {(user.role === 'SuperAdmin' || user.role === 'Admin') && (
                            <>
                                <li className="nav-item">
                                    <Link
                                        className={`nav-link ${location.pathname === "/dashboard" ? "active" : ""}`}
                                        to="/dashboard"
                                        onClick={removeToggleSidebarClass}
                                    >
                                        <i className="fa-regular fa-address-book"></i>
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                            </>
                        )}

                        {(user.role === 'SuperAdmin' || user.role === 'Admin' || user.role === 'Client') && (
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${location.pathname === "/items" ? "active" : ""}`}
                                    to="/items"
                                    onClick={removeToggleSidebarClass}
                                >
                                    <i className="fa-solid fa-boxes-stacked"></i>
                                    <span>Items</span>
                                </Link>
                            </li>
                        )}
                    </>
                )}

            </ul>
        </section>
    );
}