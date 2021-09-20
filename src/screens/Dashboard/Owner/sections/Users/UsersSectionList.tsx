import { ListGroup } from "react-bootstrap";

interface UsersListProps {
    sticky: boolean;
}

function UsersSectionList({ sticky }: UsersListProps) {
    return (
        <div className={`${sticky ? "sticky-top" : ""} mb-3`}>
            <ListGroup className="my-3">
                <ListGroup.Item href="#admins" action>
                    ادمین‌ها
                </ListGroup.Item>
                <ListGroup.Item href="#users" action>
                    کاربران عادی
                </ListGroup.Item>

            </ListGroup>
        </div>
    );
}

export default UsersSectionList;
