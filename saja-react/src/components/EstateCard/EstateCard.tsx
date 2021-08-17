import { Button } from "react-bootstrap";
import Tilt from "react-parallax-tilt";
import { Estate } from "../../global/types/Estate";

interface EstateCardProps {
    estate: Estate;
    verifyButton?: boolean;
    rejectButton?: boolean;
}

function EstateCard({
    estate,
    verifyButton = false,
    rejectButton = false,
}: EstateCardProps) {
    return (
        <Tilt>
            <div className="estate card shadow p-4 rounded-3 d-flex flex-row justify-content-between align-items-start">
                <div className="estate-info d-flex flex-column justify-content-center align-items-start">
                    <div>
                        <h4 className="estate-title fs-4 fw-normal">
                            <i className="bi-building ms-3"></i>
                            {estate.title}
                        </h4>
                    </div>
                    <h4 className="delegation-and-estate-type fs-5 fw-bold py-4">
                        {estate.delegationType} {estate.estateType}
                    </h4>
                    <h5 className="user fw-light">
                        <i className="bi-person-fill ms-3"></i>
                        {estate.user}
                    </h5>
                    <h6 className="province-and-city fw-light text-secondary">
                        {estate.city}، {estate.province}
                    </h6>
                </div>
                <div className="buttons gap-2 d-flex flex-column">
                    {verifyButton && (
                        <Button
                            className="verify-btn"
                            variant="outline-success"
                        >
                            <i className="verify-icon bi-check2"></i>
                        </Button>
                    )}
                    {rejectButton && (
                        <Button className="reject-btn" variant="outline-danger">
                            <i className="reject-icon bi-x"></i>
                        </Button>
                    )}
                    <Button className="info-btn" variant="outline-secondary">
                        <i className="info-icon bi-info-circle-fill"></i>
                    </Button>
                </div>
            </div>
        </Tilt>
    );
}

export default EstateCard;
