import Strings from 'global/constants/strings';
import { useEffect, useState } from 'react';
import { Button, Container, Form, Modal } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from './EditItemModalState';

interface Props {
  title: string;
  placeholder: string;
  editItemType: EditItemType;
}

const EditItemModal: React.FC<Props> = (props) => {
  const [modalState, setModalState] = useRecoilState(editItemModalState);
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    setNewValue(modalState.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.displayMap[props.editItemType]]);

  const cancel = () => {
    setModalState(defaultEditItemModalState);
    setNewValue('');
  };

  const submit = () => {
    if (newValue.trim() === modalState.value.trim()) return;

    const displayMap = buildMap(props.editItemType, false);
    const editMap = buildMap(props.editItemType);

    setModalState({
      ...modalState,
      value: newValue.trim(),
      displayMap: displayMap,
      editMap: editMap,
    });
    setNewValue('');
  };

  return (
    <Modal
      centered
      show={modalState.displayMap[props.editItemType]}
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
