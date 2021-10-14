import './Home.css';
import { motion } from 'framer-motion';
import { crossfadeAnimation } from '../../animations/motionVariants';
import Strings from 'global/constants/strings';

function HomeScreen() {
  return (
    <div className="home-container">
      <motion.div
        variants={crossfadeAnimation}
        initial="first"
        animate="second"
        className="content"
      >
        <h1 className="fw-light">{Strings.sajaSystem}</h1>
        <p className="app-description py-3">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با
          استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در
          ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و
          کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی
          در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می
          طلبد.
        </p>
      </motion.div>
    </div>
  );
}

export default HomeScreen;
