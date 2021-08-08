import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-right">
                <a className="nav-item btn btn-lg" href="/add-estate">
                    ثبت ملک
                </a>
                <a className="nav-item btn btn-lg" href="/search">
                    جستجوی املاک
                </a>
            </div>
            <div className="nav-center">
                <a className="nav-item nav-home btn btn-lg" href="/">
                    سامانه ثجـــا
                </a>
            </div>
            <div className="nav-left">
                <a className="nav-item btn btn-lg" href="/login">
                    ورود
                </a>
                <a className="nav-item btn btn-lg" href="/signup">
                    ثبت نام
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
