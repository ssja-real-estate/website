import { tokenAtom } from "global/states/globalStates";
import React, { useEffect, useState } from "react";
import { Card, Col, Form, ListGroup, Row, Tab } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { fetchAdmins } from "services/api/admins/adminService";
import { User } from "../../../../../../global/types/User";


const AdminList = (): JSX.Element => {
  const [searchValue, setSearchValue] = useState<string>("");

  const token = useRecoilValue(tokenAtom);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [users, setUsers] = useState<User[]>([]);


  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    const users = await fetchAdmins(token);
    setUsers(users);
  }

  return (
    <div className="users-section">
      <Tab.Container>
        <Row>
          <Col md={5} className="users-list">
            <h3 className="users-list-title fw-light mb-4">
              لیست کاربران
            </h3>
            <Form.Control
              className="mb-3"
              placeholder="جستجوی کاربران"
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
              }}
            ></Form.Control>
            <ListGroup>
              {users
                .filter((user) => {
                  return searchValue.trim() === ""
                    ? true
                    : user.userName.includes(
                      searchValue.trim()
                    ) ||
                    user.mobile.includes(
                      searchValue.trim()
                    );
                })
                .map((user, index) => {
                  return (
                    <ListGroup.Item
                      key={index}
                      action
                      href={`#user${user.mobile}`}
                    >
                      <div className="d-flex">
                        <span
                          className="user-name ms-3"
                          style={{ width: 200 }}
                        >
                          {user.userName}

                        </span>
                        <span
                          className="user-phone"
                          style={{ width: 150 }}
                        >
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
                مشخصات کاربر
              </h3>
              {users.map((user, index) => {
                return (
                  <Tab.Pane
                    key={index}
                    eventKey={`#user${user.mobile}`}
                  >
                    <Card className="shadow p-5">
                      <span className="user-name fw-bold fs-4">
                        {user.userName}
                        {/* {user.isAdmin ? (
                          <i className="bi-star-fill text-warning me-2"></i>
                        ) : null} */}
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
  );
}


export default AdminList;