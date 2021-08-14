import { useState } from "react";
import { motion } from "framer-motion";
import {
    crossfadeAnimation,
    elevationEffect,
} from "../../animations/motionVariants";
import { useRecoilState } from "recoil";
import { isLoggedInAtom } from "../../global/globalStates";
import { useHistory } from "react-router";
import { Button } from "react-bootstrap";

function AdminDashboard() {
    const [section, setSection] = useState("profile");
    const [loggedIn, setLoggedIn] = useRecoilState(isLoggedInAtom);
    const history = useHistory();

    return (
        <div className="dashboard">
            <motion.div
                variants={crossfadeAnimation}
                initial="first"
                animate="second"
                className="sidebar gap-1 card glass shadow rounded-3 text-center p-1"
            >
                <Button
                    variant=""
                    className={
                        section === "profile" ? "btn-purple" : "btn-light"
                    }
                    onClick={() => {
                        setSection("profile");
                    }}
                >
                    <i className="edit-icon bi-grid-1x2-fill"></i>
                </Button>
                <Button
                    variant=""
                    className={section === "users" ? "btn-purple" : "btn-light"}
                    onClick={() => {
                        setSection("users");
                    }}
                >
                    <i className="edit-icon bi-people-fill"></i>
                </Button>
                <Button
                    variant=""
                    className={
                        section === "estates" ? "btn-purple" : "btn-light"
                    }
                    onClick={() => {
                        setSection("estates");
                    }}
                >
                    <i className="edit-icon bi-grid-3x3-gap-fill"></i>
                </Button>
                <Button
                    variant=""
                    className={
                        section === "templates" ? "btn-purple" : "btn-light"
                    }
                    onClick={() => {
                        setSection("templates");
                    }}
                >
                    <i className="edit-icon bi-diagram-3-fill"></i>
                </Button>
            </motion.div>
            <motion.div
                variants={elevationEffect}
                initial="first"
                animate="second"
                className="admin-dashboard-section card glass shadow rounded-3 text-center p-5 me-2"
            >
                {section === "profile" ? (
                    <div className="profile">
                        <h1 className="pb-4 fw-light">رحمان رحیمی</h1>
                        <h4>
                            09123456789
                            <i className="bi-telephone-fill me-3"></i>
                        </h4>
                        <Button
                            variant="outline-danger"
                            className="rounded-3 px-4 mt-4"
                            id="edit"
                            name="edit"
                            type="button"
                            onClick={() => {
                                setLoggedIn(false);
                                history.push("/");
                            }}
                        >
                            خروج از حساب کاربری
                        </Button>
                    </div>
                ) : section === "users" ? (
                    <div>Users</div>
                ) : section === "estates" ? (
                    <div>Estates</div>
                ) : (
                    section === "templates" && <div>Templates</div>
                )}
            </motion.div>
        </div>
    );
}

export default AdminDashboard;
