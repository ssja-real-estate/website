import Strings from "global/constants/strings";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useTimer } from "react-timer-hook";

interface Props {
  seconds: number;
  title?: string;
  autoStart?: boolean | undefined;
  onExpire?: (() => void) | undefined;
}

const Timer = (props: Props) => {
  const calculateExpiryTimestamp = (): Date => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + props.seconds);
    return time;
  };

  const { minutes, seconds, isRunning, restart } = useTimer({
    expiryTimestamp: calculateExpiryTimestamp(),
    autoStart: props.autoStart,
  });

  console.log(isRunning);

  return (
    <div style={{ textAlign: "center" }}>
      <Container>
        <Row xs="auto" className="justify-content-md-center">
          <Col>
            <div style={{ fontSize: "30px" }}>
              <span>{minutes}</span>:<span>{seconds}</span>
            </div>
          </Col>
          <Col>
            <div>
              {!isRunning ? (
                <Button
                  variant="light"
                  style={{ border: "1px solid black" }}
                  onClick={() => {
                    if (!props.onExpire) return;
                    restart(calculateExpiryTimestamp());
                    props.onExpire();
                  }}
                >
                  {Strings.resendCode}
                </Button>
              ) : null}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Timer;
