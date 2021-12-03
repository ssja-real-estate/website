import Strings from "global/constants/strings";
import { globalState } from "global/states/globalStates";
import User from "global/types/User";
import { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Form,
  ListGroup,
  Row,
  Tab,
  Spinner,
  Button,
} from "react-bootstrap";
import { useRecoilValue } from "recoil";
import UserService from "services/api/UserService/UserService";

function UsersList() {
  const [searchValue, setSearchValue] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const state = useRecoilValue(globalState);
  const userService = useRef(new UserService());
  const mounted = useRef(true);

  useEffect(() => {
    userService.current.setToken(state.token);
    loadData();

    return () => {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.token]);

  const loadData = async () => {
    if (!loading) {
      setLoading(true);
    }
    const users = await userService.current.getAllUsers();
    if (mounted.current) {
      setUsers(users);
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner animation="border" variant="primary" className="my-5" />
      ) : (
        <div className="users-section">
          <Tab.Container>
            <Row>
              <Col md={5} className="users-list">
                <h3 className="users-list-title fw-light mb-4 d-inline">
                  {Strings.users}
                </h3>
                <Button
                  variant="dark"
                  className="refresh-btn d-inline rounded-circle my-2 mx-2"
                  onClick={async () => {
                    await loadData();
                  }}
                >
                  <i className="bi-arrow-counterclockwise"></i>
                </Button>
                <Form.Control
                  className="mb-3"
                  placeholder={Strings.searchUsers}
                  value={searchValue}
                  onChange={(event) => {
                    setSearchValue(event.target.value);
                  }}
                ></Form.Control>
                <ListGroup>
                  {users
                    .filter((user) => {
                      const value = searchValue.trim();
                      if (value === "") return true;

                      let result = false;
                      if (user.name) {
                        result = result || user.name.includes(value);
                      }
                      result = result || user.mobile.includes(value);

                      return result;
                    })
                    .map((user, index) => {
                      return (
                        <ListGroup.Item
                          key={index}
                          action
                          href={`#user${user.id}`}
                        >
                          <div className="d-flex">
                            <span
                              className="user-name ms-3"
                              style={{ width: 200 }}
                            >
                              {!user.name && Strings.withoutName}
                            </span>
                            <span className="user-phone" style={{ width: 150 }}>
                              {user.mobile}
                            </span>
                          </div>
                        </ListGroup.Item>
                      );
                    })}
                </ListGroup>
              </Col>
              <Col md={7} className="user-info">
                <Tab.Content className="sticky-top">
                  <h3 className="user-info-title fw-light mb-4">
                    {Strings.userInfo}
                  </h3>
                  {users.map((user, index) => {
                    return (
                      <Tab.Pane key={index} eventKey={`#user${user.id}`}>
                        <Card className="shadow p-5">
                          <span className="user-name fw-bold fs-4">
                            {user.name ? user.name : Strings.withoutName}
                          </span>
                          <span className="user-phone pt-4">
                            {user.mobile}
                            <i className="bi-telephone-fill me-2"></i>
                          </span>
                        </Card>
                      </Tab.Pane>
                    );
                  })}
                </Tab.Content>
              </Col>
            </Row>
          </Tab.Container>
        </div>
      )}
    </>
  );
}

export default UsersList;
