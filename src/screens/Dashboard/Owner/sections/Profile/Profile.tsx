import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { atom, useRecoilState } from 'recoil';
import { isLoggedInAtom } from '../../../../../global/states/globalStates';

const showEditProfileModalAtom = atom({
  key: 'ownerShowEditProfileState',
  default: false,
});

function ProfileSection() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [show, setShow] = useRecoilState(showEditProfileModalAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loggedIn, setLoggedIn] = useRecoilState(isLoggedInAtom);
  const history = useHistory();

  return (
    <div className="profile-section">
      <h1 className="user-name pb-4 fw-light">
        رحمان رحیمی
        <i className="bi-star-fill text-warning me-3"></i>
      </h1>
      <h4 className="user-phone">
        09123456789
        <i className="bi-telephone-fill me-3"></i>
      </h4>
      <div className="d-flex flex-column justify-content-center align-items-center">
        <EditProfileModal />
        <Button
          variant="outline-secondary"
          className="rounded-3 px-4 my-4"
          id="edit"
          name="edit"
          type="button"
          onClick={() => {
            setShow(true);
          }}
        >
          ویرایش حساب کاربری
        </Button>
        <Button
          variant="outline-danger"
          className="rounded-3 px-4"
          id="logout"
          name="logout"
          type="button"
          onClick={() => {
            setLoggedIn(false);
            history.push('/');
          }}
        >
          خروج از حساب کاربری
        </Button>
      </div>
    </div>
  );
}

function EditProfileModal() {
  const [show, setShow] = useRecoilState(showEditProfileModalAtom);

  return (
    <Modal
      centered
      show={show}
      onHide={() => {
        setShow(false);
      }}
    >
      <Modal.Header>
        <Modal.Title>ویرایش حساب کاربری</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Container>
            <Form.Control
              type="text"
              id="name"
              name="name"
              placeholder="نام و نام خانوادگی"
              className="mt-4"
            />
            <Form.Control
              type="text"
              id="phone"
              name="phone"
              placeholder="شماره موبایل"
              className="my-4"
            />
          </Container>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-3"
          variant="outline-secondary"
          onClick={() => {
            setShow(false);
          }}
        >
          لغو
        </Button>
        <Button
          className="rounded-3"
          variant="purple"
          onClick={() => {
            setShow(false);
          }}
        >
          ذخیره
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ProfileSection;
