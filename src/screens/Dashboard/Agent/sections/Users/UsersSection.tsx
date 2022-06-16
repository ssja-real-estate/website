import { Col, Row, Tab } from "react-bootstrap";
import AgentList from "./AgentList/AgentList";
import UsersSectionList from "./UsersSectionList";

function UsersSection() {
  return (
    <Tab.Container>
      <Row>
        <Col md={2}>
          <UsersSectionList sticky />
        </Col>
        <Col md={10}>
          <Tab.Content>
            <Tab.Pane eventKey="#agents">
              <AgentList />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default UsersSection;
