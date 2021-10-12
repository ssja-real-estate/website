import { useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import './ListItem.css';

interface ListItemProps {
  title: string;
  onRemove?: Function;
  onEdit?: Function;
}

function ListItem({ title, onEdit, onRemove }: ListItemProps) {
  const [redColor, setRedColor] = useState<boolean>(false);

  return (
    <ListGroup.Item
      action
      className="list-item d-flex flex-row justify-content-between align-items-center"
      variant={redColor ? 'danger' : ''}
    >
      {title}
      <div>
        <i
          className="bi-pencil-square mx-3"
          onClick={() => {
            onEdit && onEdit();
          }}
        ></i>
        <i
          className="remove-icon bi-x-lg"
          onClick={() => {
            setRedColor((prev) => !prev);
            onRemove && onRemove();
          }}
        ></i>
      </div>
    </ListGroup.Item>
  );
}

export default ListItem;
