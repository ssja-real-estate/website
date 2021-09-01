import { Row, Col } from "react-bootstrap";
import DelegationTypesList from "./DelegationTypesList";
import EstateTypesList from "./EstateTypesList";

function DelegationsAndEstates() {
    return (
        <Row>
            <Col>
                <DelegationTypesList />
            </Col>
            <Col>
                <EstateTypesList />
            </Col>
        </Row>
    );
}

export default DelegationsAndEstates;
