import Strings from "global/constants/strings";
import MapInfo, { defaultMapInfo } from "global/types/MapInfo";
import { useEffect, useState } from "react";
import { Button, Container, Form, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import { useRecoilState } from "recoil";
import editItemModalState, {
  buildMap,
  defaultEditItemModalState,
  EditItemType,
} from "./EditItemModalState";

interface Props {
  title: string;
  placeholder: string;
  editItemType: EditItemType;
}

const EditItemModal: React.FC<Props> = (props) => {
  const [modalState, setModalState] = useRecoilState(editItemModalState);
  const [newValue, setNewValue] = useState("");
  const [mapInfo, setMapInfo] = useState<MapInfo>(defaultMapInfo);

  useEffect(() => {
    setNewValue(modalState.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.displayMap[props.editItemType]]);

  const cancel = () => {
    setModalState(defaultEditItemModalState);
    setNewValue("");
    setMapInfo(defaultMapInfo);
  };

  const submit = () => {
    // if (newValue.trim() === modalState.value.trim()) {
    //   return;
    // }

    if (mapInfo.zoom) {
      if (mapInfo.zoom < 5 || mapInfo.zoom > 15) {
        toast.error(Strings.invalidZoomRange);
        return;
      }
    }

    const displayMap = buildMap(props.editItemType, false);
    const editMap = buildMap(props.editItemType);

    setModalState({
      ...modalState,
      value: newValue.trim(),
      displayMap: displayMap,
      editMap: editMap,
      mapInfo: mapInfo,
    });
    setNewValue("");
    setMapInfo(defaultMapInfo);
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
            <Form.Group controlId="fgName">
              <Form.Label>{props.placeholder}</Form.Label>
              <Form.Control
                type="text"
                value={newValue}
                onChange={(e) => {
                  setNewValue(e.currentTarget.value);
                }}
              />
            </Form.Group>
            {props.editItemType === EditItemType.Province ||
            props.editItemType === EditItemType.City ||
            props.editItemType === EditItemType.Neighborhood ? (
              <>
                <Form.Group className="mt-3" controlId="fgLatitude">
                  <Form.Label>{Strings.latitude}</Form.Label>
                  <Form.Control
                    type="text"
                    value={mapInfo.latitude}
                    onChange={(e) => {
                      setMapInfo({
                        ...mapInfo,
                        latitude: +e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mt-3" controlId="fgLongitude">
                  <Form.Label>{Strings.longitude}</Form.Label>
                  <Form.Control
                    type="text"
                    value={mapInfo.longitude}
                    onChange={(e) => {
                      setMapInfo({
                        ...mapInfo,
                        longitude: +e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
                <Form.Group className="mt-3">
                  <Form.Label>{Strings.zoom}</Form.Label>
                  <Form.Control
                    type="text"
                    value={mapInfo.zoom}
                    onChange={(e) => {
                      setMapInfo({
                        ...mapInfo,
                        zoom: +e.currentTarget.value,
                      });
                    }}
                  />
                </Form.Group>
              </>
            ) : null}
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
