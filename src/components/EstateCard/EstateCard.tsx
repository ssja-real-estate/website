import Strings from "global/constants/strings";
import { MouseEventHandler } from "react";
import { Button } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import { Estate } from "../../global/types/Estate";

interface EstateCardProps {
  estate: Estate;
  verifyButton?: boolean;
  rejectButton?: boolean;
  onVerify?: MouseEventHandler;
  onReject?: MouseEventHandler;
  onShowEstateInfo?: MouseEventHandler;
  onCloseEstateInfo?: () => void;
}

function EstateCard({
  estate,
  verifyButton = false,
  rejectButton = false,
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
          {estate.rejectionStatus.rejected && <small>{Strings.rejected}</small>}
        </div>
        <div className="buttons gap-2 d-flex flex-column">
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
          <Button className="info-btn" variant="outline-secondary">
            <i
              className="info-icon bi-info-circle-fill"
              onClick={onShowEstateInfo}
            ></i>
          </Button>
        </div>
      </div>
    </Tilt>
  );
}

export default EstateCard;
