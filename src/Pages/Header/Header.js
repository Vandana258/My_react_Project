import { Link, useNavigate } from "react-router-dom";

export default function Header({ title, toggleSidebar }) {
  const navigate = useNavigate();
  const authUser = localStorage.getItem('user');
  const user = JSON.parse(authUser);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="top-header">
      <div className="row row-cols-md-auto justify-content-between align-items-center">
        <div className="col col-5">
        {(user?.role === "SuperAdmin" || user?.role === "Admin")?
          (<div className="d-flex align-items-center justify-content-sm-between">
              <span className="toggle-sidebar-btn cursor-pointer d-xl-none d-sm-block" onClick={toggleSidebar}><i className="fa-solid fa-bars-staggered"></i></span>
              {(title === "Dashboard") && 
                <div className="ms-2">
                  <button type="button" className="back-btn" onClick={handleGoBack}>
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                </div>
              }
              {/* <div className="heading">{title || t("Title")}</div> */}
              <div className="heading ms-2">{title || ""}</div>
            </div>)
          :
          <Link className="navbar-brand px-0 client-page-logo" to={(user?.role === "SuperAdmin" || user?.role === "Admin")? "/clients":"/offer_details"}>
              <img src={process.env.REACT_APP_BASE_URL + "assets/img/logo/logodecorato.png"} className="img-fluid" />
          </Link>
          }
        </div>

        <div className="col col-3">
          <div className="dropdown cursor-pointer">
            <div className="d-flex align-items-center dropdown-toggle" data-bs-toggle="dropdown"
              aria-expanded="false">
              <div className="user-profile">
                <img src={user.image ? user.image : process.env.REACT_APP_BASE_URL + "/assets/img/images.webp"} className="rounded-circle" width="40" />
              </div>
            </div>
            <ul className="dropdown-menu dropdown-menu-end border-0 shadow">
              <li>
                <div className="user-name">
                  <p>{(user?.lastName ? `${user?.name} ${user?.lastName}` : user?.name)}</p>
                </div>
              </li>
              <li>
                <div className="dropdown-divider"></div>
              </li>
              {/* { (user?.role === "Client") &&
                (<li>   
                  <Link className="dropdown-item" to="/offer_details">
                    <i className="fa-solid fa-certificate me-2"></i>
                    <span className="">{('Your Offers')}</span>
                  </Link>
                </li>)
              } */}
              <li>
                <Link className="dropdown-item" to="/profile">
                  <i className="fa-solid fa-gear me-2"></i>
                  <span className="">{('Setting')}</span>
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/login" onClick={handleLogout}>
                  <i className="fa-solid fa-power-off me-2"></i>
                  <span className="">{('Logout')}</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}