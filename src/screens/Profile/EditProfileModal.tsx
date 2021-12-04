import React, { useEffect, useRef, useState } from "react";
import Strings from "global/constants/strings";
import { Modal, Form, Container, Button } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";
import { globalState } from "global/states/globalStates";
import UserService from "services/api/UserService/UserService";
import { profileModalState } from "./ProfileState";

interface Props {
  userId?: string;
  name?: string;
  reloadScreen?: () => Promise<void>;
}

const EditProfileModal: React.FC<Props> = ({ userId, name, reloadScreen }) => {
  const [newName, setNewName] = useState(name ?? "");
  const [modalState, setModalState] = useRecoilState(profileModalState);

  const state = useRecoilValue(globalState);
  const service = useRef(new UserService());
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  });

  const toggleModalDisplay = (flag: boolean) => {
    setModalState({
      ...modalState,
      showEditProfile: flag,
    });
    if (mounted.current) {
      setNewName("");
    }
  };

  const editProfile = async () => {
    service.current.setToken(state.token);
    const user = await service.current.editProfile(userId ?? "", newName);
    if (user) {
      if (reloadScreen) {
        reloadScreen();
      }
      toggleModalDisplay(false);
    }
  };

  const cancel = () => {
    toggleModalDisplay(false);
    if (reloadScreen) {
      reloadScreen();
    }
    if (mounted.current) {
      setNewName("");
    }
  };

  return (
    <Modal
      centered
      show={modalState.showEditProfile}
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
              type="text"
              id="name"
              name="name"
              placeholder={Strings.fullName}
              className="mt-4"
              value={newName}
              onChange={(e) => {
                setNewName(e.currentTarget.value);
              }}
            />
          </Container>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="rounded-3"
          variant="outline-secondary"
          onClick={cancel}
        >
          {Strings.cancel}
        </Button>
        <Button className="rounded-3" variant="purple" onClick={editProfile}>
          {Strings.save}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileModal;
