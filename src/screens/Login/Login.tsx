import './Login.css';
import { Link, useHistory } from 'react-router-dom';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { elevationEffect } from '../../animations/motionVariants';
import { useSetRecoilState } from 'recoil';
import { globalState } from '../../global/states/globalStates';
import { Button, Form, InputGroup } from 'react-bootstrap';
import Strings from 'global/constants/strings';
import UserService from 'services/api/UserService/UserService';
import RegexValidator from 'services/utilities/RegexValidator';
import toast from 'react-hot-toast';

function LoginScreen() {
  const [visibility, setVisibility] = useState(false);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const setGlobalState = useSetRecoilState(globalState);

  const history = useHistory();
  const service = useRef(new UserService());

  function togglePasswordVisibility() {
    setVisibility(!visibility);
  }

  const loginUser = async () => {
    if (!RegexValidator.validatePhone(mobile)) {
      toast.error(Strings.invalidPhoneNumber);
      return;
    }
    if (!RegexValidator.validatePassword(password)) {
      toast.error(Strings.invalidPassword);
      return;
    }
    const loginState = await service.current.loginUser(mobile, password);

    if (loginState) {
      setGlobalState(loginState!);
      history.push('/dashboard');
    }
  };

  return (
    <div className="login-container">
      <motion.div
        variants={elevationEffect}
        initial="first"
        animate="second"
        className="login card glass shadow rounded-3 py-4 px-3"
      >
        <h1 className="login-title text-center">{Strings.login}</h1>
        <form className="login-form">
          <Form.Control
            className="form-control rounded-3 py-2 my-3"
            name="phone"
            placeholder={Strings.mobile}
            id="phone"
            value={mobile}
            onChange={(e) => {
              setMobile(e.currentTarget.value);
            }}
          />
          <Form.Control
            className="form-control rounded-3 py-2 my-3"
            type={visibility ? 'text' : 'password'}
            name="password"
            placeholder={Strings.password}
            id="password"
            value={password}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
          />
          <InputGroup>
            <Form.Check
              name="visCheck"
              id="visCheck"
              checked={visibility}
              onChange={togglePasswordVisibility}
              label={Strings.showPassword}
            />
          </InputGroup>
          <div className="text-center my-3">
            <span className="fw-light">{Strings.forgotPassowrd}</span>
            <a
              className="purple fw-bold text-decoration-none me-2"
              href="/restore-password"
            >
              {Strings.recoverPassword}
            </a>
          </div>
          <Button
            variant="purple"
            className="w-100 rounded-3"
            type="submit"
            name="submit"
            id="submit"
            onClick={(event) => {
              event.preventDefault();
              loginUser();
            }}
          >
            {Strings.sajaLogin}
          </Button>
          <div className="text-center my-3">
            <span className="fw-light">{Strings.dontHaveAnAccount}</span>
            <Link
              className="purple fw-bold text-decoration-none me-2"
              to="/signup"
            >
              {Strings.signup}
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginScreen;
