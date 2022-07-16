import Strings from "global/constants/strings";
import MapInfo, { defaultMapInfo } from "global/types/MapInfo";
import { SetStateAction, useEffect, useState } from "react";
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
  const [zoom, setZoom] = useState<string>("0");
  const [credit, setCredit] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

  useEffect(() => {
    setNewValue(modalState.value);
    if (modalState.mapInfo) {
      setMapInfo(modalState.mapInfo);
      setZoom(modalState.mapInfo.zoom.toString());
    }
    setCredit(modalState.credit ?? 0);
    setDuration(modalState.duration ?? 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalState.displayMap[props.editItemType]]);

  const cancel = () => {
    setModalState(defaultEditItemModalState);
    setNewValue("");
    setMapInfo(defaultMapInfo);
  };

  const submit = () => {
    const displayMap = buildMap(props.editItemType, false);
    const editMap = buildMap(props.editItemType);

    if (isNaN(+zoom)) {
      toast.error(Strings.invalidZoomValue);
      return;
    }

    setModalState({
      ...modalState,
      value: newValue.trim(),
      displayMap: displayMap,
      editMap: editMap,
      mapInfo: { ...mapInfo, zoom: parseFloat(zoom) },
      title: newValue.trim(),
      credit,
      duration,
    });
    setNewValue("");
    setMapInfo(defaultMapInfo);
    setZoom("0");
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
                onChange={(e: {
                  currentTarget: { value: SetStateAction<string> };
                }) => {
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
                    onChange={(e: {
                      currentTarget: { value: string | number };
                    }) => {
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
                    onChange={(e: {
                      currentTarget: { value: string | number };
                    }) => {
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
                    type="float"
                    value={zoom}
                    onChange={(e: {
                      currentTarget: { value: SetStateAction<string> };
                    }) => {
                      setZoom(e.currentTarget.value);
                    }}
                  />
                </Form.Group>
              </>
            ) : null}
            {props.editItemType === EditItemType.Payment ? (
              <>
                <Form.Group className="mt-3" controlId="fgCredit">
                  <Form.Label>{Strings.creditAmount}</Form.Label>
                  <Form.Control
                    type="number"
                    value={credit}
                    onChange={(e: {
                      currentTarget: { value: string | number };
                    }) => {
                      setCredit(+e.currentTarget.value);
                    }}
                  />
                </Form.Group>
                <Form.Group className="mt-3" controlId="fgLongitude">
                  <Form.Label>{Strings.paymentDuration}</Form.Label>
                  <Form.Control
                    type="number"
                    value={duration}
                    onChange={(e: {
                      currentTarget: { value: string | number };
                    }) => {
                      setDuration(+e.currentTarget.value);
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
