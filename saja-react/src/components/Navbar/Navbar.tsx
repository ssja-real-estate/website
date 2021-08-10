import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar bg-white shadow-sm sticky-top">
            <div className="nav-right">
                <Link className="nav-item btn btn-lg" to="/add-estate">
                    ثبت ملک
                    <i className="bi-building pe-2" />
                </Link>
                <Link className="nav-item btn btn-lg" to="/search-estate">
                    جستجوی املاک
                    <i className="bi-search pe-2" />
                </Link>
            </div>
            <div className="nav-center">
                <Link className="nav-item nav-home btn btn-lg" to="/">
                    سامانه ثجـــا
                </Link>
            </div>
            <div className="nav-left">
                <Link className="nav-item btn btn-lg" to="/login">
                    ورود / ثبت نام
                    <i className="bi-box-arrow-in-left pe-2" />
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;
