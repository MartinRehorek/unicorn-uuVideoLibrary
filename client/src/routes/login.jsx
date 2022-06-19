/** @jsxImportSource @emotion/react */

import React, { useState } from 'react';
import { Alert, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { useAuth } from 'utils/hooks/useAuth';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [showAlert, setShowAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState('');
  const [alertText, setAlertText] = useState('');
  const [validated, setValidated] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    const responseErrorMessage = () => {
      setUsername('');
      setPassword('');

      setAlertStatus('danger');
      setAlertText('Nemáte přístupová práva');
      setShowAlert(true);
    };

    if (form.checkValidity() === true) {
      signIn(username, password)
        .then((response) => {
          if (response) {
            setAlertStatus('success');
            setAlertText('Přihlášení proběhlo úspěšně');
            setShowAlert(true);
            setTimeout(() => {
              navigate('/');
            }, 1000);
          } else {
            setValidated(false);
            responseErrorMessage();
          }
        })
        .catch(() => {
          responseErrorMessage();
        });
    }

    setValidated(true);
  };

  return (
    <>
      <Row>
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
          <h1 className="login__title">Přihlášení</h1>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Control
                required
                type="text"
                placeholder="Uživatelské jméno"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <Form.Control.Feedback type="invalid">Zadejte Uživatelské jméno</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Control
                required
                type="password"
                placeholder="Heslo"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <Form.Control.Feedback type="invalid">Zadejte heslo</Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid gap-2 pt-3">
              <Button variant="primary" size="lg" type="submit" className="login__button">
                Přihlásit se
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
    </>
  );
};

export default Login;
