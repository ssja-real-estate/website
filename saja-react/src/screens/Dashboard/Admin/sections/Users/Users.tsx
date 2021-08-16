import { useState } from "react";
import { Card, Col, Form, ListGroup, Row, Tab } from "react-bootstrap";

interface User {
    name: string;
    phone: string;
    isAdmin: boolean;
}

function UsersSection() {
    const [searchValue, setSearchValue] = useState<string>("");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [users, setUsers] = useState<User[]>([
        { name: "رحمان رحیمی", phone: "09123456234", isAdmin: true },
        { name: "ابراهیم حسن پور", phone: "09112876789", isAdmin: false },
        { name: "رحفهخغعن", phone: "09148764744", isAdmin: false },
        { name: "رحمااااااااان", phone: "09148744444", isAdmin: false },
        { name: "رحمااابااااااان", phone: "09148764244", isAdmin: false },
        { name: "رحناماااان", phone: "09148744646", isAdmin: false },
        { name: "رحااااااان", phone: "09148764443", isAdmin: false },
        { name: "رحااااااان", phone: "09148764344", isAdmin: false },
        { name: "رحااااااان", phone: "09154487644", isAdmin: false },
        { name: "رحااااااان", phone: "09148876484", isAdmin: false },
        { name: "رحااااااان", phone: "09148765444", isAdmin: false },
        { name: "رحااااااان", phone: "09147658876", isAdmin: false },
        { name: "رحااااااان", phone: "09148764844", isAdmin: false },
        { name: "رحااااااان", phone: "09148766844", isAdmin: false },
        { name: "رحااااااان", phone: "09148764446", isAdmin: false },
        { name: "رحااااااان", phone: "09146678788", isAdmin: false },
        { name: "رحااااااان", phone: "09148764444", isAdmin: false },
        { name: "رحااااااان", phone: "09148764484", isAdmin: false },
        { name: "رحااااااان", phone: "09187687487", isAdmin: false },
        { name: "رحااااااان", phone: "09148768878", isAdmin: false },
        { name: "رحااااااان", phone: "09148756444", isAdmin: false },
    ]);

    return (
        <div className="users-section">
            <Tab.Container>
                <Row>
                    <Col md={6} className="users-list">
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
                                        : user.name.includes(
                                              searchValue.trim()
                                          ) ||
                                              user.phone.includes(
                                                  searchValue.trim()
                                              );
                                })
                                .map((user, index) => {
                                    return (
                                        <ListGroup.Item
                                            key={index}
                                            action
                                            href={`#user${user.phone}`}
                                        >
                                            <div className="d-flex">
                                                <span
                                                    className="user-name ms-3"
                                                    style={{ width: 200 }}
                                                >
                                                    {user.name}
                                                    {user.isAdmin ? (
                                                        <i className="bi-star-fill text-warning me-2"></i>
                                                    ) : null}
                                                </span>
                                                <span
                                                    className="user-phone"
                                                    style={{ width: 150 }}
                                                >
                                                    {user.phone}
                                                </span>
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })}
                        </ListGroup>
                    </Col>
                    <Col md={6} className="user-info">
                        <Tab.Content className="sticky-top">
                            <h3 className="user-info-title fw-light mb-4">
                                مشخصات کاربر
                            </h3>
                            {users.map((user, index) => {
                                return (
                                    <Tab.Pane
                                        key={index}
                                        eventKey={`#user${user.phone}`}
                                    >
                                        <Card className="shadow p-5">
                                            <span className="user-name fw-bold fs-4">
                                                {user.name}
                                                {user.isAdmin ? (
                                                    <i className="bi-star-fill text-warning me-2"></i>
                                                ) : null}
                                            </span>
                                            <span className="user-phone pt-4">
                                                {user.phone}
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

export default UsersSection;
