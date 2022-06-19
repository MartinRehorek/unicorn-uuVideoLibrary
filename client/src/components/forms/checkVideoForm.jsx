import React, { useState } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';

import { getInfoFromYoutubeAPIService } from 'services/admin/admin';

const CheckVideoForm = ({ onGetYoutubeData }) => {
  const [youtubeURL, setYoutubeURL] = useState('');

  const [validated, setValidated] = useState(false);
  const [alertStatus, setAlertStatus] = useState('');
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const responseErrorMessage = (text) => {
    setAlertStatus('danger');
    setAlertText(text);
    setShowAlert(true);
  };

  const getVideoByYTAPI = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      getInfoFromYoutubeAPIService(youtubeURL)
        .then((response) => {
          if (response.status === 200) {
            onGetYoutubeData(response.data.data);
            setValidated(true);
          } else {
            setValidated(false);
            responseErrorMessage('Prosíme, zkontaktujte administrátora aplikace');
          }
        })
        .catch(() => {
          setValidated(false);
          responseErrorMessage('Prosíme, zkontaktujte administrátora aplikace');
        });
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={getVideoByYTAPI} className="createVideo__form">
        <Form.Group className="mb-3" controlId="formBasicVideoYoutubeUrl">
          <Form.Control
            required
            type="text"
            placeholder="Youtube URL"
            value={youtubeURL}
            onChange={(event) => setYoutubeURL(event.target.value)}
          />
          <Form.Control.Feedback type="invalid">Zadejte URL z Youtube</Form.Control.Feedback>
        </Form.Group>

        <div className="d-grid gap-2 pt-3">
          <Button variant="primary" size="sm" type="submit" className="mb-5">
            Získej informace
          </Button>
        </div>
      </Form>

      {showAlert && (
        <Alert variant={alertStatus} className="mt-2 mb-5" onClose={() => setShowAlert(false)} dismissible>
          {alertText}
        </Alert>
      )}
    </>
  );
};

export default CheckVideoForm;
