import "./Navbar.css";
import { useHistory } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { globalState } from "global/states/globalStates";
import Strings from "global/constants/strings";
import commissionModalState from "components/CommissionModal/CommissionModalState";
import CommissionModal from "components/CommissionModal/CommissionModal";

function AppNavbar() {
  const [modalState, setModalState] = useRecoilState(commissionModalState);
  const state = useRecoilValue(globalState);
  const history = useHistory();

  return (
    <Navbar
      collapseOnSelect
      expand="md"
      sticky="top"
      bg="white"
      variant="light"
      className="navbar shadow-sm"
    >
      <Container>
        <Navbar.Brand className="ms-4">
          <Nav.Link
            className="fs-3 fw-bold purple"
            onClick={() => {
              history.push("/");
            }}
          >
            {Strings.sajaSystem}
          </Nav.Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar" />
        <Navbar.Collapse id="responsive-navbar">
          <Nav className="ms-auto">
            <Nav.Link
              className="fs-5 m-2"
              onClick={() => {
                history.push("/add-estate");
              }}
            >
              {Strings.addEstates}
              <i className="bi-building pe-2" />
            </Nav.Link>
            <Nav.Link
              className="ms-4 fs-5 m-2"
              onClick={() => {
                history.push("/search-estate");
              }}
            >
              {Strings.searchEstates}
              <i className="bi-search pe-2" />
            </Nav.Link>
          </Nav>
          <Nav>
            {!state.loggedIn ? (
              <Nav.Link
                className="fs-5 m-2"
                onClick={() => {
                  history.push("/login");
                }}
              >
                {Strings.loginOrSignup}
                <i className="bi-box-arrow-in-left pe-2" />
              </Nav.Link>
            ) : (
              <>
                <NavDropdown title={Strings.inquiries} className="fs-5 m-2">
                  <NavDropdown.Item onClick={() => {}}>
                    {Strings.documentInquiry}
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => {}}>
                    {Strings.proxyInquiry}
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={() => {}}>
                    {Strings.onlineChequeInquiry}
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link className="fs-5 m-2" onClick={() => {}}>
                  {Strings.contractSamples}
                </Nav.Link>
                <NavDropdown title={Strings.laws} className="fs-5 m-2">
                  <NavDropdown.Item onClick={() => {}}>
                    {Strings.civilLaw}
                  </NavDropdown.Item>
                </NavDropdown>
                <CommissionModal />
                <Nav.Link
                  className="fs-5 m-2"
                  onClick={() => {
                    setModalState({
                      ...modalState,
                      showCommissionModal: true,
                    });
                  }}
                >
                  {Strings.commissionCalculation}
                </Nav.Link>
                <Nav.Link
                  className="fs-5 m-2"
                  onClick={() => {
                    history.push("/dashboard");
                  }}
                >
                  {Strings.dashboard}
                  <i className="bi-person-fill pe-2" />
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
