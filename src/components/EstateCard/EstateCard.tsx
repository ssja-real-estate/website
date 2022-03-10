import Strings from "global/constants/strings";
import { MouseEventHandler } from "react";
import { Button } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import { Estate } from "../../global/types/Estate";

interface EstateCardProps {
  estate: Estate;
  editButton?: boolean;
  verifyButton?: boolean;
  rejectButton?: boolean;
  showEstateInfoButton?: boolean;
  onEdit?: MouseEventHandler;
  onVerify?: MouseEventHandler;
  onReject?: MouseEventHandler;
  onShowEstateInfo?: MouseEventHandler;
  onCloseEstateInfo?: () => void;
}

function EstateCard({
  estate,
  editButton = false,
  verifyButton = false,
  rejectButton = false,
  showEstateInfoButton = false,
  onEdit,
  onVerify,
  onReject,
  onShowEstateInfo,
  onCloseEstateInfo,
}: EstateCardProps) {
  return (
    <Tilt>
      <div className="estate card shadow p-4 rounded-3 d-flex flex-row justify-content-between align-items-start">
        <div className="estate-info d-flex flex-column justify-content-center align-items-start">
          <div>
            <h4 className="estate-title fs-4 fw-normal">
              <i className="bi-building ms-3"></i>
              {estate.dataForm.title}
            </h4>
          </div>
          <h6 className="fw-light text-secondary">
            {Strings.province} : {estate.province.name}
          </h6>
          <h6 className="fw-light text-secondary">
            {Strings.city} : {estate.city.name}
          </h6>
          <h6 className="fw-light text-secondary">
            {Strings.neighborhood} : {estate.neighborhood.name}
          </h6>
        </div>
        <div className="buttons gap-2 d-flex flex-column">
          {editButton && (
            <Button className="info-btn" variant="outline-primary">
              <i className="bi-pencil" onClick={onEdit}></i>
            </Button>
          )}
          {verifyButton && (
            <Button
              className="verify-btn"
              variant="outline-success"
              onClick={onVerify}
            >
              <i className="verify-icon bi-check2"></i>
            </Button>
          )}
          {rejectButton && (
            <Button
              className="reject-btn"
              variant="outline-danger"
              onClick={onReject}
            >
              <i className="reject-icon bi-x"></i>
            </Button>
          )}
          {showEstateInfoButton && (
            <Button className="info-btn" variant="outline-secondary">
              <i
                className="info-icon bi-info-circle-fill"
                onClick={onShowEstateInfo}
              ></i>
            </Button>
          )}
        </div>
      </div>
    </Tilt>
  );
}

export default EstateCard;
