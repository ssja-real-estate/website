import { Form } from "react-bootstrap";

import { FieldContainerProps } from "global/componentProps/FieldContainerProps";

const FieldContainer: React.FC<FieldContainerProps> = ({
  controlId,
  label,
  containerStyle,
  div,
  labelStyle,
  children,
}) => {
  const childrenComponent = () => {
    return (
      <>
        {label && <Form.Label className={labelStyle}>{label}</Form.Label>}
        {children}
      </>
    );
  };

  return div ? (
    <div className={containerStyle}>{childrenComponent()}</div>
  ) : (
    <Form.Group className={containerStyle} controlId={controlId}>
      {childrenComponent()}
    </Form.Group>
  );
};

export default FieldContainer;
