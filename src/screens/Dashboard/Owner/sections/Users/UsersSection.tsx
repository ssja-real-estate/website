import { Col, Row, Tab } from "react-bootstrap";
import AdminList from "./AdminList/AdminList";
import UsersSectionList from "./UsersSectionList";
import UsersList from "./UsersLists/UsersList";
import OwnerList from "./OwnerList/OwnerList";
import AgentList from "./AgentList/AgentList";

function UsersSection() {
  return (
    <Tab.Container>
      <Row>
        <Col md={2}>
          <UsersSectionList sticky />
        </Col>
        <Col md={10}>
          <Tab.Content>
            <Tab.Pane eventKey="#owners">
              <OwnerList />
            </Tab.Pane>
            <Tab.Pane eventKey="#admins">
              <AdminList />
            </Tab.Pane>
            <Tab.Pane eventKey="#agents">
              <AgentList />
            </Tab.Pane>
            <Tab.Pane eventKey="#users">
              <UsersList />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default UsersSection;
