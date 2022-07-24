import Strings from "global/constants/strings";
import { defaultGlobalState } from "global/states/GlobalState";
import { globalState } from "global/states/globalStates";
import { profileModalState } from "./ProfileState";
import User, { defaultUser } from "global/types/User";
import { useRef, useState, useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import UserService from "services/api/UserService/UserService";
import ChangePasswordModal from "./ChangePasswordModal";
import BuyCreditModal from "./BuyCreditModal";
import PaymentService from "services/api/PaymentService/PaymentService";
import { Payment } from "global/types/Payment";

const Profile = () => {
  const [modalState, setModalState] = useRecoilState(profileModalState);
  const [state, setGlobalState] = useRecoilState(globalState);
  const [user, setUser] = useState<User>(defaultUser);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
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
    history.push("/");
  };

  return (
    <>
      {loading ? (
        <Spinner animation="border" variant="primary" className="my-5" />
      ) : (
        <div className="profile-section">
          <h4 className="user-phone">
            {user.mobile}
            <i className="bi-telephone-fill me-3"></i>
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
            <h4>{Strings.noCreditForThisUser}</h4>
          )}
          <br></br>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <ChangePasswordModal userId={user.id} reloadScreen={loadData} />
            <BuyCreditModal payments={payments} reloadScreen={loadData} />
            <Button
              variant="outline-secondary"
              className="rounded-3 px-4 w-75"
              id="passwordInput"
              name="passwordInput"
              type="button"
              onClick={() => {
                toggleChangePasswordModalDisplay(true);
              }}
            >
              {Strings.changePassword}
            </Button>
            <Button
              variant="outline-secondary"
              className="rounded-3 my-4 w-75"
              id="creditInput"
              name="creditInput"
              type="button"
              onClick={() => {
                toggleBuyCreditModalDisplay(true);
              }}
            >
              {Strings.buyCredit}
            </Button>
            <Button
              variant="outline-danger"
              className="rounded-3 px-4 w-75"
              id="logout"
              name="logout"
              type="button"
              onClick={logout}
            >
              {Strings.logout}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
