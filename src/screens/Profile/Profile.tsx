import Strings from 'global/constants/strings';
import { defaultGlobalState } from 'global/states/GlobalState';
import { globalState } from 'global/states/globalStates';
import { profileModalState } from './ProfileState';
import User, { defaultUser } from 'global/types/User';
import { useRef, useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import UserService from 'services/api/UserService/UserService';
import EditProfileModal from './EditProfileModal';
import ChangePasswordModal from './ChangePasswordModal';

const Profile = () => {
  const [modalState, setModalState] = useRecoilState(profileModalState);
  const [state, setGlobalState] = useRecoilState(globalState);
  const [user, setUser] = useState<User>(defaultUser);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const service = useRef(new UserService());
  const mounted = useRef(true);

  useEffect(() => {
    if (mounted.current) {
      service.current.setToken(state.token);
      loadData();
    }

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const toggleModalDisplay = (flag: boolean, isEditProfile: boolean = true) => {
    if (isEditProfile) {
      setModalState({
        ...modalState,
        showEditProfile: flag,
        showChangePassword: false,
      });
    } else {
      setModalState({
        ...modalState,
        showEditProfile: false,
        showChangePassword: flag,
      });
    }
  };

  const loadData = async () => {
    if (!loading) {
      setLoading(true);
    }
    const fetchedUser = await service.current.getUser(state.userId);
    setUser(fetchedUser);
    setLoading(false);
  };

  const logout = () => {
    setGlobalState(defaultGlobalState);
    history.push('/');
  };

  return (
    <>
      {loading ? (
        <Spinner animation="border" variant="primary" className="my-5" />
      ) : (
        <div className="profile-section">
          {user.name ? (
            <h1 className="user-name pb-4 fw-light">{user.name}</h1>
          ) : null}
          <h4 className="user-phone">
            {user.mobile}
            <i className="bi-telephone-fill me-3"></i>
          </h4>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <EditProfileModal
              userId={user.id}
              name={user.name}
              reloadScreen={loadData}
            />
            <ChangePasswordModal userId={user.id} reloadScreen={loadData} />
            <Button
              variant="outline-secondary"
              className="rounded-3 px-4 mt-4 w-75"
              id="edit"
              name="edit"
              type="button"
              onClick={() => {
                toggleModalDisplay(true);
              }}
            >
              {Strings.editProfile}
            </Button>
            <Button
              variant="outline-secondary"
              className="rounded-3 px-4 my-4 w-75"
              id="passwordInput"
              name="passwordInput"
              type="button"
              onClick={() => {
                toggleModalDisplay(true, false);
              }}
            >
              {Strings.changePassword}
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
