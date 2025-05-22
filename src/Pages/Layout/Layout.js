import { useState } from "react";
import Header from "../Header/Header";
import Sidebar from "../Sidebar/Sidebar";

export const Layout = ({ children, title }) => {
    // const { children } = props
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        document.body.classList.toggle("toggle-sidebar");
    };
    return (
        <>
            <div className="page-wrapper">
                <Sidebar toggleSidebar={toggleSidebar} />
                <section className="main-content" id="main-content">
                    <Header title={title} toggleSidebar={toggleSidebar} />
                    <div className="main">
                        {children}
                    </div>
                </section>
            </div>
            {/* <Footer/> */}
            {/* <section className="footer" id="footer">
                <Footer/>
            </section> */}
        </>
    );
}