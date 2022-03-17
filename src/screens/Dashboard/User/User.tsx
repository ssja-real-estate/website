import { motion } from "framer-motion";
import { elevationEffect } from "../../../animations/motionVariants";
import { atom, useRecoilValue } from "recoil";
import UserSidebar from "./Sidebar";
import EstatesSection from "./sections/Estates/Estates";
import Profile from "screens/Profile/Profile";

export const userSectionAtom = atom({
  key: "userSidebarState",
  default: "profile",
});

function UserDashboard() {
  const section = useRecoilValue(userSectionAtom);

  return (
    <div className="dashboard">
      <UserSidebar />
      <motion.div
        variants={elevationEffect}
        initial="first"
        animate="second"
        className="user-dashboard-section card glass shadow rounded-3 text-center p-5 me-2"
      >
        {section === "profile" ? (
          <Profile />
        ) : (
          section === "my-estates" && <EstatesSection />
        )}
      </motion.div>
    </div>
  );
}

export default UserDashboard;
