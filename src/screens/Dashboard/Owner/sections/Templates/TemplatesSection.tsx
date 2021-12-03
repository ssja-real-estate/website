import { Col, Row, Tab } from "react-bootstrap";
import ProvinceList from "./ProvinceList/ProvinceList";
import CityList from "./CityList/CityList";
import DelegationTypesList from "./DelegationTypes/DelegationTypesList";
import EstateTypesList from "./EstateTypes/EstateTypesList";
import TemplatesList from "./TemplatesList";
import UnitList from "./UnitList/UnitList";
import Forms from "screens/Dashboard/Forms/Forms";

function TemplatesSection() {
  return (
    <Tab.Container>
      <Row>
        <Col md={2}>
          <TemplatesList sticky />
        </Col>
        <Col md={10}>
          <Tab.Content>
            <Tab.Pane eventKey="#delegationTypes">
              <DelegationTypesList />
            </Tab.Pane>
            <Tab.Pane eventKey="#estateTypes">
              <EstateTypesList />
            </Tab.Pane>
            <Tab.Pane eventKey="#provinceList">
              <ProvinceList />
            </Tab.Pane>
            <Tab.Pane eventKey="#cityList">
              <CityList />
            </Tab.Pane>
            <Tab.Pane eventKey="#units">
              <UnitList />
            </Tab.Pane>
            <Tab.Pane eventKey="#forms">
              <Forms />
            </Tab.Pane>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container>
  );
}

export default TemplatesSection;
