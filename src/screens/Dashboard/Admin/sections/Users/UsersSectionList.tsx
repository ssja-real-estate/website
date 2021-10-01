import Strings from 'global/constants/strings';
import { ListGroup } from 'react-bootstrap';

interface UsersListProps {
  sticky: boolean;
}

function UsersSectionList({ sticky }: UsersListProps) {
  return (
    <div className={`${sticky ? 'sticky-top' : ''} mb-3`}>
      <ListGroup className="my-3">
        <ListGroup.Item href="#users" action>
          {Strings.users}
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default UsersSectionList;
