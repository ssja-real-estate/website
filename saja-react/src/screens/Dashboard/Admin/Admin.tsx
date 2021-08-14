import { motion } from "framer-motion";
import { elevationEffect } from "../../../animations/motionVariants";
import { atom, useRecoilState, useRecoilValue } from "recoil";
import { isLoggedInAtom } from "../../../global/globalStates";
import { useHistory } from "react-router";
import { Button } from "react-bootstrap";
import AdminSidebar from "./Sidebar";

export const adminSectionAtom = atom({
    key: "adminSidebarState",
    default: "profile",
});

function AdminDashboard() {
    const section = useRecoilValue(adminSectionAtom);
    const [loggedIn, setLoggedIn] = useRecoilState(isLoggedInAtom);
    const history = useHistory();

    return (
        <div className="dashboard">
            <AdminSidebar />
            <motion.div
                variants={elevationEffect}
                initial="first"
                animate="second"
                className="admin-dashboard-section card glass shadow rounded-3 text-center p-5 me-2"
            >
                {section === "profile" ? (
                    <div className="profile">
                        <h1 className="pb-4 fw-light">
                            رحمان رحیمی
                            <i className="bi-star-fill text-warning me-3"></i>
                        </h1>
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
