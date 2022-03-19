import Strings from "global/constants/strings";
import { ListGroup } from "react-bootstrap";

interface TemplatesListProps {
  sticky: boolean;
}

function TemplatesList({ sticky }: TemplatesListProps) {
  return (
    <div className={`${sticky ? "sticky-top" : ""} mb-3`}>
      <ListGroup className="my-3">
        <ListGroup.Item href="#delegationTypes" action>
          {Strings.delegationTypes}
        </ListGroup.Item>
        <ListGroup.Item href="#estateTypes" action>
          {Strings.estateTypes}
        </ListGroup.Item>
        <ListGroup.Item href="#provinceList" action>
          {Strings.provinces}
        </ListGroup.Item>
        <ListGroup.Item href="#cityList" action>
          {Strings.cities}
        </ListGroup.Item>
        <ListGroup.Item href="#neighborhoodList" action>
          {Strings.neighborhoods}
        </ListGroup.Item>
        <ListGroup.Item href="#units" action>
          {Strings.units}
        </ListGroup.Item>
        <ListGroup.Item href="#forms" action>
          {Strings.forms}
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default TemplatesList;
