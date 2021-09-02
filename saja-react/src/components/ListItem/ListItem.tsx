import { useState } from "react";
import { ListGroup } from "react-bootstrap";
import "./ListItem.css";

interface ListItemProps {
    title: string;
    onRemove?: Function;
}

function ListItem({ title, onRemove }: ListItemProps) {
    const [redColor, setRedColor] = useState<boolean>(false);

    return (
        <ListGroup.Item
            action
            className="list-item d-flex flex-row justify-content-between align-items-center"
            variant={redColor ? "danger" : ""}
        >
            {title}
            <i
                className="remove-icon bi-x-lg"
                onClick={() => {
                    setRedColor((prev) => !prev);
                    onRemove && onRemove();
                }}
            ></i>
        </ListGroup.Item>
    );
}

export default ListItem;
