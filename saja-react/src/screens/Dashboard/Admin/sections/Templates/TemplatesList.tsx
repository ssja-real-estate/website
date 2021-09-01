import { ListGroup } from "react-bootstrap";

interface TemplatesListProps {
    sticky: boolean;
}

function TemplatesList({ sticky }: TemplatesListProps) {
    return (
        <ListGroup className={sticky ? "sticky-top" : ""}>
            <ListGroup.Item href="#delegationTypes" action>
                نوع واگذاری ها
            </ListGroup.Item>
            <ListGroup.Item href="#estateTypes" action>
                نوع ملک ها
            </ListGroup.Item>
            <ListGroup.Item href="#provinceList" action>
                استان ها
            </ListGroup.Item>
            <ListGroup.Item href="#cityList" action>
                شهر ها
            </ListGroup.Item>
            <ListGroup.Item href="#forms" action>
                فرم ها
            </ListGroup.Item>
        </ListGroup>
    );
}

export default TemplatesList;
