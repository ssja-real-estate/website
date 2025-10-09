import { SetStateAction, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import Strings from "../../../data/strings";
import { globalState } from "../../../global/states/globalStates";
import UserService from "../../../services/api/UserService/UserService";
import { profileModalState } from "./ProfileState";
import GlobalState from "../../../global/states/GlobalState";

interface Props {
  userId: string;
  reloadScreen?: () => Promise<void>;
}

const ChangePasswordModal: React.FC<Props> = ({ userId, reloadScreen }) => {
  const [modalState, setModalState] = useRecoilState(profileModalState);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [visibility, setVisibility] = useState(false);

  const state = useRecoilValue<GlobalState>(globalState);
  const userService = useRef(new UserService());
  const mounted = useRef(true);

  useEffect(() => {
    userService.current.setToken(state.token);

    return () => {
      mounted.current = false;
    };
  }, [state.token]);

  const toggleModalDisplay = (flag: boolean) => {
    setModalState({
      ...modalState,
      showChangePassword: flag,
    });
  };

  const changePassword = async () => {
    if (confirmationPassword !== newPassword) {
      // toast.error(Strings.invalidRepeatPassword);
      alert(Strings.invalidRepeatPassword);
    }
    if (userId === "" || !mounted.current) return;

    const message = await userService.current.changePassword(
      currentPassword,
      newPassword
    );

    if (!message) return;
    // toast.success(message, { duration: 2000 });
    // alert(message);
    if (!reloadScreen) return;
    reloadScreen();
  };
  const modalMui = (
    <div className="fixed bg-black/40 inset-0 z-50  flex h-full w-full items-center justify-center">
      <div className="py-2 flex flex-col items-center justify-center  bg-white h-50 rounded-lg gap-4 w-[80%] sm:w-[70%] md:w-[50%] lg:w-[35%]">
        <div className="font-bold text-xl px-2 border-b w-full py-2">
          {Strings.editProfile}
        </div>
        <form className="w-full flex flex-col gap-5 px-16">
          <div className="">
            <input
              type={visibility ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder={Strings.currentPassword}
              className="mt-4 inputDecoration"
              value={currentPassword}
              onChange={(e: {
                currentTarget: { value: SetStateAction<string> };
              }) => {
                setCurrentPassword(e.currentTarget.value);
              }}
            />
          </div>
          <div className="">
            <input
              type={visibility ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder={Strings.newPassword}
              className="mt-4 inputDecoration"
              value={newPassword}
              onChange={(e: {
                currentTarget: { value: SetStateAction<string> };
              }) => {
                setNewPassword(e.currentTarget.value);
              }}
            />
          </div>
          <div className="">
            <input
              type={visibility ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder={Strings.repeatNewPassword}
              className="mt-4 inputDecoration"
              value={confirmationPassword}
              onChange={(e: {
                currentTarget: { value: SetStateAction<string> };
              }) => {
                setConfirmationPassword(e.currentTarget.value);
              }}
            />
          </div>
          <div className="flex flex-row items-center  w-full gap-1">
            <label htmlFor="visCheck">{Strings.showPassword}</label>
            <input
              type="checkbox"
              name="visCheck"
              id="visCheck"
              className="px-1 my-3"
              checked={visibility}
              onChange={() => {
                setVisibility(!visibility);
              }}
            />
          </div>
        </form>
        <div className="flex flex-row items-center justify-end gap-2 px-2 border-t w-full pt-2">
          <button
            onClick={() => {
              setConfirmationPassword("");
              setCurrentPassword("");
              setNewPassword("");
              toggleModalDisplay(false);
            }}
            className="px-7 py-2 bg-gray-400 text-white rounded-md"
          >
            {Strings.cancel}
          </button>
          <button
            onClick={changePassword}
            className="px-7 py-2 bg-[#d99221] text-white rounded-md"
          >
            {Strings.save}
          </button>
        </div>
      </div>
    </div>
  );
  return modalState.showChangePassword
    ? ReactDOM.createPortal(modalMui, document.body)
    : null;
};

export default ChangePasswordModal;
