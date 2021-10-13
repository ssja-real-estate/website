import Strings from 'global/constants/strings';
import { globalState } from 'global/states/globalStates';
import User, { defaultUser, Role, roleMap } from 'global/types/User';
import { useEffect, useRef, useState } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  InputGroup,
  ListGroup,
  Row,
  Spinner,
  Tab,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import UserService from 'services/api/UserService/UserService';

function UsersList() {
  const [searchValue, setSearchValue] = useState<string>('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>(defaultUser);

  const state = useRecoilValue(globalState);
  const userService = useRef(new UserService());
  const mounted = useRef(true);

  useEffect(() => {
    if (mounted.current) {
      userService.current.setToken(state.token);
      loadData();
    }

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
    setUsers(users);
    setLoading(false);
  };

  const changeRole = async () => {
    if (selectedUser.id === '') return;
    const userId = selectedUser.id;
    const role = selectedUser.role;
    setLoading(true);
    await userService.current.changeUserRole(userId, role);
    await loadData();
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
                      if (value === '') return true;
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
                          onClick={() => {
                            setSelectedUser({
                              id: user.id,
                              mobile: user.mobile,
                              role: user.role,
                              name: user.name,
                            });
                          }}
                        >
                          <div className="d-flex">
                            <span
                              className="user-name ms-3"
                              style={{ width: 200 }}
                            >
                              {user.name ? user.name : Strings.withoutName}
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
                          <InputGroup
                            className="my-3"
                            style={{ direction: 'ltr' }}
                          >
                            <Button
                              variant="purple"
                              onClick={async () => {
                                await changeRole();
                              }}
                            >
                              {Strings.save}
                            </Button>
                            <Form.Select
                              value={selectedUser.role}
                              onChange={(e) => {
                                const roleString = e.currentTarget.value;
                                if (roleString) {
                                  const role = Number(roleString) as Role;
                                  setSelectedUser({
                                    ...selectedUser,
                                    role,
                                  });
                                }
                              }}
                            >
                              {roleMap.map((role, index) => {
                                return (
                                  <option key={index} value={role.role}>
                                    {role.roleName}
                                  </option>
                                );
                              })}
                            </Form.Select>
                          </InputGroup>
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
