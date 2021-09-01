import { Col, Row, Tab } from "react-bootstrap";
import DelegationsAndEstates from "./DelegationsAndEstates/DelegationsAndEstates";
import Forms from "./Forms/Forms";
import Locations from "./Locations/Locations";
import TemplatesList from "./TemplatesList";

function TemplatesSection() {
    return (
        <Tab.Container>
            <Row>
                <Col md={4}>
                    <TemplatesList />
                </Col>
                <Col md={8}>
                    <Tab.Content>
                        <Tab.Pane eventKey="#d&e">
                            <DelegationsAndEstates />
                        </Tab.Pane>
                        <Tab.Pane eventKey="#locations">
                            <Locations />
                        </Tab.Pane>
                        <Tab.Pane eventKey="#forms">
                            <Forms />
                        </Tab.Pane>
                    </Tab.Content>
                </Col>
            </Row>
        </Tab.Container>
    );
}

export default TemplatesSection;
