import "./Dashboard.css";
import { useState } from "react";
import { motion } from "framer-motion";
import {
    crossfadeAnimation,
    elevationEffect,
} from "../../animations/motionVariants";
import Button from "../../components/Button/Button";
import { useRecoilState, useRecoilValue } from "recoil";
import { isLoggedInAtom, userTypeAtom } from "../../global/globalStates";
import { useHistory } from "react-router";

function DashboardScreen() {
    const isAdmin = useRecoilValue(userTypeAtom) === "admin" ? true : false;

    return (
        <div className="dashboard-container">
            {isAdmin ? <AdminDashboard /> : <UserDashboard />}
        </div>
    );
}

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
                className="sidebar card glass shadow rounded-3 text-center p-1"
            >
                <button
                    className="btn"
                    onClick={() => {
                        setSection("profile");
                    }}
                >
                    <i
                        className={`edit-icon ${
                            section === "profile"
                                ? "bi-grid-1x2-fill"
                                : "bi-grid-1x2"
                        }`}
                    ></i>
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        setSection("users");
                    }}
                >
                    <i
                        className={`edit-icon ${
                            section === "users" ? "bi-people-fill" : "bi-people"
                        }`}
                    ></i>
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        setSection("estates");
                    }}
                >
                    <i
                        className={`edit-icon ${
                            section === "estates"
                                ? "bi-grid-3x3-gap-fill"
                                : "bi-grid-3x3-gap"
                        }`}
                    ></i>
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        setSection("templates");
                    }}
                >
                    <i
                        className={`edit-icon ${
                            section === "templates"
                                ? "bi-diagram-3-fill"
                                : "bi-diagram-3"
                        }`}
                    ></i>
                </button>
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
                            className="btn btn-outline-danger rounded-3 px-4 mt-4"
                            id="edit"
                            name="edit"
                            type="button"
                            value="خروج از حساب کاربری"
                            onClick={() => {
                                setLoggedIn(false);
                                history.push("/");
                            }}
                        />
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

function UserDashboard() {
    const [section, setSection] = useState("profile");
    const [loggedIn, setLoggedIn] = useRecoilState(isLoggedInAtom);
    const history = useHistory();

    return (
        <div className="dashboard">
            <motion.div
                variants={crossfadeAnimation}
                initial="first"
                animate="second"
                className="sidebar card glass shadow rounded-3 text-center p-1"
            >
                <button
                    className="btn"
                    onClick={() => {
                        setSection("profile");
                    }}
                >
                    <i
                        className={`edit-icon ${
                            section === "profile"
                                ? "bi-grid-1x2-fill"
                                : "bi-grid-1x2"
                        }`}
                    ></i>
                </button>
                <button
                    className="btn"
                    onClick={() => {
                        setSection("estates");
                    }}
                >
                    <i
                        className={`edit-icon ${
                            section === "estates"
                                ? "bi-grid-3x3-gap-fill"
                                : "bi-grid-3x3-gap"
                        }`}
                    ></i>
                </button>
            </motion.div>
            <motion.div
                variants={elevationEffect}
                initial="first"
                animate="second"
                className="user-dashboard-section card glass shadow rounded-3 text-center p-5 me-2"
            >
                {section === "profile" ? (
                    <div className="profile">
                        <h1 className="pb-4 fw-light">رحمان رحیمی</h1>
                        <h4>
                            09123456789
                            <i className="bi-telephone-fill me-3"></i>
                        </h4>
                        <Button
                            className="btn btn-outline-danger rounded-3 px-4 mt-4"
                            id="edit"
                            name="edit"
                            type="button"
                            value="خروج از حساب کاربری"
                            onClick={() => {
                                setLoggedIn(false);
                                history.push("/");
                            }}
                        />
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

export default DashboardScreen;
