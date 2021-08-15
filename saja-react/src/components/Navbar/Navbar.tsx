import "./Navbar.css";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { isLoggedInAtom } from "../../global/globalStates";
import { Col, Row } from "react-bootstrap";

function Navbar() {
    const loggedIn = useRecoilValue(isLoggedInAtom);

    return (
        <motion.nav
            initial={{ y: -200 }}
            animate={{ y: 0 }}
            transition={{
                type: "spring",
                mass: 0.5,
            }}
            className="navbar bg-white shadow-sm sticky-top"
        >
            <Row className="w-100">
                <Col sm={9}>
                    <Link className="nav-item nav-home btn mx-3" to="/">
                        سامانه ثجـــا
                    </Link>
                    <Link className="nav-item btn mx-3" to="/add-estate">
                        ثبت ملک
                        <i className="bi-building pe-2" />
                    </Link>
                    <Link className="nav-item btn" to="/search-estate">
                        جستجوی املاک
                        <i className="bi-search pe-2" />
                    </Link>
                </Col>
                <Col
                    sm={3}
                    className="d-flex flex-row justify-content-end align-items-center"
                >
                    {!loggedIn ? (
                        <Link className="nav-item btn" to="/login">
                            ورود / ثبت نام
                            <i className="bi-box-arrow-in-left pe-2" />
                        </Link>
                    ) : (
                        <Link className="nav-item btn" to="/dashboard">
                            حساب کاربری
                            <i className="bi-person-fill pe-2" />
                        </Link>
                    )}
                </Col>
            </Row>
        </motion.nav>
    );
}

export default Navbar;
