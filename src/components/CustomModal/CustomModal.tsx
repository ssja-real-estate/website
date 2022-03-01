import { Button, Modal } from "react-bootstrap";

interface CustomModalProps {
  show: boolean;
  title?: string;
  cancelTitle?: string;
  successTitle?: string;
  isLarge?: boolean;
  isFullscreen?: boolean;
  handleClose: () => void;
  handleSuccess?: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({
  show = false,
  title = "Modal Title",
  cancelTitle = "Close",
  successTitle = "Save",
  handleClose,
  handleSuccess,
  isLarge = false,
  isFullscreen = false,
  children,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size={isLarge ? "lg" : undefined}
      fullscreen={isFullscreen ? true : undefined}
      centered
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        {handleClose && (
          <Button variant="secondary" onClick={handleClose}>
            {cancelTitle}
          </Button>
        )}
        {handleSuccess && (
          <Button variant="purple" onClick={handleSuccess}>
            {successTitle}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default CustomModal;
