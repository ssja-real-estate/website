import Strings from 'global/constants/strings';
import { useState } from 'react';
import { Button, Container, Form, InputGroup, Modal } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useRecoilState } from 'recoil';
import { profileModalState } from './ProfileState';

interface Props {
  userId: string;
  reloadScreen?: () => Promise<void>;
}

const ChangePasswordModal: React.FC<Props> = ({ userId, reloadScreen }) => {
  const [modalState, setModalState] = useRecoilState(profileModalState);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');
  const [visibility, setVisibility] = useState(false);

  const toggleModalDisplay = (flag: boolean) => {
    setModalState({
      ...modalState,
      showChangePassword: flag,
    });
  };

  const changePassword = async () => {
    if (confirmationPassword !== newPassword) {
      toast.error(Strings.invalidRepeatPassword);
    }

    if (userId === '') return;
  };

  return (
    <Modal
      centered
      show={modalState.showChangePassword}
      onHide={() => {
        toggleModalDisplay(false);
      }}
    >
      <Modal.Header>
        <Modal.Title>{Strings.editProfile}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Container>
            <Form.Control
              type={visibility ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              placeholder={Strings.currentPassword}
              className="mt-4"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.currentTarget.value);
              }}
            />
            <Form.Control
              type={visibility ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              placeholder={Strings.newPassword}
              className="mt-4"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.currentTarget.value);
              }}
            />
            <Form.Control
              type={visibility ? 'text' : 'password'}
              id="newPassword"
              name="newPassword"
              placeholder={Strings.repeatNewPassword}
              className="mt-4"
              value={confirmationPassword}
              onChange={(e) => {
                setConfirmationPassword(e.currentTarget.value);
              }}
            />
            <InputGroup>
              <Form.Check
                name="visCheck"
                id="visCheck"
                className="px-1 my-3"
                checked={visibility}
                onChange={(e) => {
                  setVisibility(!visibility);
                }}
                label={Strings.showPassword}
              />
            </InputGroup>
          </Container>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-3"
          variant="outline-secondary"
          onClick={() => {
            toggleModalDisplay(false);
          }}
        >
          {Strings.cancel}
        </Button>
        <Button className="rounded-3" variant="purple" onClick={changePassword}>
          {Strings.save}
        </Button>
      </Modal.Footer>{' '}
    </Modal>
  );
};

export default ChangePasswordModal;
