import Image from "next/image";
import Router, { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import Strings from "../../../data/strings";
import { defaultGlobalState } from "../../../global/states/GlobalState";
import { globalState } from "../../../global/states/globalStates";
import { Payment } from "../../../global/types/Payment";
import User, { defaultUser } from "../../../global/types/User";
import PaymentService from "../../../services/api/PaymentService/PaymentService";
import UserService from "../../../services/api/UserService/UserService";
import Spiner from "../../spinner/Spiner";
import BuyCreditModal from "./BuyCreditModal";
import ChangePasswordModal from "./ChangePasswordModal";
import EditProfile from "./EditProfile";
import ProfileHome from "./ProfileHome";
import { profileModalState } from "./ProfileState";
import * as FaIcon from "react-icons/fa";

const Profile: React.FC<{ children?: JSX.Element }> = (props) => {
  const router = useRouter();
  const [modalState, setModalState] = useRecoilState(profileModalState);
  const [state, setGlobalState] = useRecoilState(globalState);
  const [user, setUser] = useState<User>(defaultUser);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  // const history = useHistory();
  const service = useRef(new UserService());
  const paymentService = useRef(new PaymentService());
  const mounted = useRef(true);

  useEffect(() => {
    service.current.setToken(state.token);
    paymentService.current.setToken(state.token);
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const toggleChangePasswordModalDisplay = (flag: boolean) => {
    setModalState({
      ...modalState,
      showEditProfile: false,
      showBuyCreditModal: false,
      showChangePassword: flag,
    });
  };

  const toggleBuyCreditModalDisplay = (flag: boolean) => {
    setModalState({
      ...modalState,
      showEditProfile: false,
      showChangePassword: false,
      showBuyCreditModal: flag,
    });
  };

  const loadData = async () => {
    if (!loading) {
      setLoading(true);
    }
    const fetchedUser = await service.current.getUser(state.userId);
    const fetchedPayments = await paymentService.current.getAllPayments();
    if (mounted.current) {
      setUser(fetchedUser);
      setPayments(fetchedPayments);
      setLoading(false);
      toggleChangePasswordModalDisplay(false);
      toggleBuyCreditModalDisplay(false);
    }
  };

  const logout = () => {
    setGlobalState(defaultGlobalState);
    router.push("/");
  };

  // const [isEdit, setEdit] = useState(false);
  // const editProfile = (): void => {
  //   setEdit(true);
  // };
  // const exitEdit = (): void => {
  //   setEdit(false);
  // };

  return (
    <>
      {loading ? (
        <Spiner />
      ) : (
        <div className="flex flex-col justify-center items-center">
          <h4 className="text-2xl font-bold flex flex-row items-center justify-center gap-3">
            <span> {user.mobile}</span>

            <FaIcon.FaPhoneAlt />
          </h4>
          <br></br>
          {user.credit?.id ? (
            <>
              <h5>
                {Strings.creditType} : {user.credit.title}
              </h5>
              <hr></hr>
              <h5>
                {user.credit?.remainingDuration &&
                user.credit?.remainingDuration > 0
                  ? `${user.credit?.remainingDuration} ${Strings.remainingDuration}`
                  : `${Strings.lastDay}`}
              </h5>
            </>
          ) : (
            <h4 className="text-gray-400 font-bold text-2xl">
              {Strings.noCreditForThisUser}
            </h4>
          )}

          <div className="mt-10 gap-2 flex flex-col justify-center items-center w-full">
            <ChangePasswordModal userId={user.id} reloadScreen={loadData} />
            <BuyCreditModal payments={payments} reloadScreen={loadData} />
            <button
              className="border w-full p-2 rounded-md transition duration-150 hover:text-white hover:bg-[#0ba] hover:border-none"
              id="passwordInput"
              name="passwordInput"
              type="button"
              onClick={() => {
                toggleChangePasswordModalDisplay(true);
              }}
            >
              {Strings.changePassword}
            </button>
            <button
              className="border w-full p-2 rounded-md transition duration-150 hover:text-white hover:bg-[#0ba] hover:border-none"
              id="creditInput"
              name="creditInput"
              type="button"
              onClick={() => {
                toggleBuyCreditModalDisplay(true);
              }}
            >
              {Strings.buyCredit}
            </button>
            <button
              className="border w-full p-2 rounded-md transition duration-150 hover:text-white hover:bg-red-700 hover:border-none"
              id="logout"
              name="logout"
              type="button"
              onClick={logout}
            >
              {Strings.logout}
            </button>
          </div>
        </div>
      )}
    </>
  );
  // return (
  //   <>
  //     {!isEdit ? (
  //       <ProfileHome onEdit={editProfile} />
  //     ) : (
  //       <EditProfile onExitEdit={exitEdit} />
  //     )}
  //   </>
  // );
};

export default Profile;
