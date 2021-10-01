import { Col, Row, Tab } from 'react-bootstrap';
import UsersList from './UsersList/UsersList';
import UsersSectionList from './UsersSectionList';

function UsersSection() {
  return (
    <Tab.Container>
      <Row>
        <Col md={2}>
          <UsersSectionList sticky />
        </Col>
        <Col md={10}>
          <Tab.Content>
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
