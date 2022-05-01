import "./Home.css";
import { motion } from "framer-motion";
import { crossfadeAnimation } from "../../animations/motionVariants";
import Strings from "global/constants/strings";

function HomeScreen() {
  return (
    <div className="home-container">
      <motion.div
        variants={crossfadeAnimation}
        initial="first"
        animate="second"
        className="content"
      >
        <h1 className="fw-light">{Strings.sajaSystemCompleteName}</h1>
        <footer>
          <a
            referrerPolicy="origin"
            target="_blank"
            href="https://trustseal.enamad.ir/?id=272685&amp;Code=mpSx0xjRfdtYxeZVHICW"
          >
            <img
              referrerPolicy="origin"
              src="https://Trustseal.eNamad.ir/logo.aspx?id=272685&amp;Code=mpSx0xjRfdtYxeZVHICW"
              alt=""
              style={{ cursor: "pointer" }}
              id="mpSx0xjRfdtYxeZVHICW"
            />
          </a>
        </footer>
      </motion.div>
    </div>
  );
}

export default HomeScreen;
