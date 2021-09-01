import { ListGroup } from "react-bootstrap";

function TemplatesList() {
    return (
        <ListGroup>
            <ListGroup.Item href="#d&e" action>
                نوع واگذاری ها و ملک ها
            </ListGroup.Item>
            <ListGroup.Item href="#locations" action>
                استان ها و شهر ها
            </ListGroup.Item>
            <ListGroup.Item href="#forms" action>
                فرم ها و ورودی ها
            </ListGroup.Item>
        </ListGroup>
    );
}

export default TemplatesList;
