import React from 'react';
import { useState } from 'react';
import { Alert, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { signUpService } from 'services/user/user';

import { TIME_OUT_RESPONSE } from 'utils/constants';

const SignUp = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [email, setEmail] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState('');
  const [alertText, setAlertText] = useState('');
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      signUpService(username, password, email, 'user')
        .then(() => {
          setAlertStatus('success');
          setAlertText('Uživatel byl úspěšně vytvořen');
          setShowAlert(true);

          setTimeout(() => {
            navigate('/');
          }, TIME_OUT_RESPONSE);
        })
        .catch(() => {
          setUsername('');
          setEmail('');
          setPassword('');
          setPasswordCheck('');

          setAlertStatus('danger');
          setAlertText('Něco je špatně');
          setShowAlert(true);
        });
    }

    setValidated(true);
  };

  return (
    <Row>
      <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
        <h1 className="sign-up__title">Vytvořit účet</h1>

        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Control
              required
              type="text"
              placeholder="Jméno"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Form.Control.Feedback type="invalid">Zadejte Jméno</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <Form.Control.Feedback type="invalid">Zadejte Email</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword1">
            <Form.Control
              required
              type="password"
              placeholder="Heslo"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Form.Control.Feedback type="invalid">Zadejte Heslo</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword2">
            <Form.Control
              required
              type="password"
              placeholder="Heslo znova"
              value={passwordCheck}
              onChange={(event) => setPasswordCheck(event.target.value)}
            />
            <Form.Control.Feedback type="invalid">Zadejte Heslo znova</Form.Control.Feedback>
          </Form.Group>

          <div className="d-grid gap-2 pt-3">
            <Button variant="primary" size="lg" type="submit" className="sign-up__button">
              Registrovat se
            </Button>
          </div>
        </Form>

        {showAlert && (
          <Alert variant={alertStatus} className="mt-5" onClose={() => setShowAlert(false)} dismissible>
            {alertText}
          </Alert>
        )}
      </Col>
    </Row>
  );
};

export default SignUp;
