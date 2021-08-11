import notFound from "../../images/404/404_screen.png";
import { motion } from "framer-motion";
import { crossfadeAnimation } from "../../motion/motionVariants";
import "./NotFound.css";

function NotFoundScreen() {
    return (
        <motion.div
            variants={crossfadeAnimation}
            initial="first"
            animate="second"
            className="main-container"
        >
            <img src={notFound} alt="404 Not Found!" />
        </motion.div>
    );
}

export default NotFoundScreen;
