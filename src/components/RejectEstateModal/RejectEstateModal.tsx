import Strings from "global/constants/strings";
import { Form } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { rejectEstateAtom } from "./RejectEstateModalState";

const RejectEstateModal = () => {
  const [rejectEstateState, setRejectEstateState] =
    useRecoilState(rejectEstateAtom);

  return (
    <div>
      <Form.Label>{Strings.description}</Form.Label>
      <Form.Control
        type="text"
        value={rejectEstateState.description}
        onChange={(e) => {
          setRejectEstateState({
            ...rejectEstateState,
            description: e.currentTarget.value,
          });
        }}
      />
    </div>
  );
};

export default RejectEstateModal;
