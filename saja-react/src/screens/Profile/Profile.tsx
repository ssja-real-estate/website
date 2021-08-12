import { motion } from "framer-motion";
import { elevationEffect } from "../../animations/motionVariants";
import Button from "../../components/Button/Button";
import "./Profile.css";

function ProfileScreen() {
    return (
        <div className="profile-container">
            <motion.div
                variants={elevationEffect}
                initial="first"
                animate="second"
                className="profile"
            >
                <div className="card glass shadow rounded-3 text-center p-1">
                    <button className="btn">
                        <i className="edit-icon bi-pencil-square"></i>
                    </button>
                </div>
                <div className="card glass shadow rounded-3 text-center p-5 me-2">
                    <h1 className="pb-4 fw-light">رحمان رحیمی</h1>
                    <h4>
                        09123456789<i className="bi-telephone-fill me-3"></i>
                    </h4>
                    <Button
                        className="btn btn-outline-danger rounded-3 px-4 mt-4"
                        id="edit"
                        name="edit"
                        type="button"
                        value="خروج از حساب کاربری"
                    />
                </div>
            </motion.div>
        </div>
    );
}

export default ProfileScreen;
