import Strings from 'global/constants/strings';
import { useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import editItemModalState, {
  defaultEditItemModalState,
} from './EditItemModalState';

interface Props {
  title: string;
  placeholder: string;
  editDelegationType?: boolean;
  editEstateType?: boolean;
  editProvince?: boolean;
  editCity?: boolean;
  editUnit?: boolean;
}

const EditItemModal: React.FC<Props> = (props) => {
  const [modalState, setModalState] = useRecoilState(editItemModalState);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    setNewValue(modalState.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.displayModal]);

  const cancel = () => {
    setModalState(defaultEditItemModalState);
    setNewValue('');
  };

  const submit = () => {
    if (newValue.trim() === modalState.value.trim()) return;

    setModalState({
      ...modalState,
      value: newValue.trim(),
      displayModal: false,
      editDelegationType: props.editDelegationType,
      editEstateType: props.editEstateType,
      editProvince: props.editProvince,
      editCity: props.editCity,
      editUnit: props.editUnit,
    });
    setNewValue('');
  };

  return (
    <Modal
      centered
      show={modalState.displayModal}
      onHide={() => {
        cancel();
      }}
    >
      <Modal.Header>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Container>
            <Form.Control
              type="text"
              id="name"
              name="name"
              placeholder={props.placeholder}
              className="mt-4"
              value={newValue}
              onChange={(e) => {
                setNewValue(e.currentTarget.value);
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
        <Button className="rounded-3" variant="purple" onClick={submit}>
          {Strings.save}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditItemModal;
