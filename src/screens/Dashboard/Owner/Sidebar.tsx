import { motion } from "framer-motion";
import Strings from "global/constants/strings";
import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { crossfadeAnimation } from "../../../animations/motionVariants";
import { ownerSectionAtom } from "./Owner";

function OwnerSidebar() {
  const [section, setSection] = useRecoilState(ownerSectionAtom);

  return (
    <motion.div
      variants={crossfadeAnimation}
      initial="first"
      animate="second"
      className="sidebar gap-1 card glass shadow rounded-3 text-center p-1 my-2"
    >
      <OverlayTrigger
        placement="left"
        overlay={
          <Tooltip id="profile-tooltip">{Strings.profileTooltip}</Tooltip>
        }
      >
        <Button
          variant=""
          className={section === "profile" ? "btn-purple" : "btn-light"}
          onClick={() => {
            setSection("profile");
          }}
        >
          <i className="bi-grid-1x2-fill"></i>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="left"
        overlay={<Tooltip id="users-tooltip">{Strings.usersTooltip}</Tooltip>}
      >
        <Button
          variant=""
          className={section === "users" ? "btn-purple" : "btn-light"}
          onClick={() => {
            setSection("users");
          }}
        >
          <i className="bi-people-fill"></i>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="left"
        overlay={
          <Tooltip id="estates-tooltip">{Strings.estatesTooltip}</Tooltip>
        }
      >
        <Button
          variant=""
          className={section === "estates" ? "btn-purple" : "btn-light"}
          onClick={() => {
            setSection("estates");
          }}
        >
          <i className="bi-grid-3x3-gap-fill"></i>
        </Button>
      </OverlayTrigger>
      <OverlayTrigger
        placement="left"
        overlay={
          <Tooltip id="templates-tooltip">{Strings.templatesTooltip}</Tooltip>
        }
      >
        <Button
          variant=""
          className={section === "templates" ? "btn-purple" : "btn-light"}
          onClick={() => {
            setSection("templates");
          }}
        >
          <i className="bi-diagram-3-fill"></i>
        </Button>
      </OverlayTrigger>
    </motion.div>
  );
}

export default OwnerSidebar;
