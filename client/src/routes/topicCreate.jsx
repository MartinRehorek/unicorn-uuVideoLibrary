/** @jsxImportSource @emotion/react */

import React, { useState } from 'react';

import { Alert, Form, Button, Row, Col } from 'react-bootstrap';
import { BlockPicker } from 'react-color';

import { createTopicService } from 'services/topic/topic';
import { PICKER_COLORS, TIME_OUT_RESPONSE } from 'utils/constants';

const TopicCreate = () => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#2196f3');
  const [thumbnailURL, setThumbnailURL] = useState('');

  const [showAlert, setShowAlert] = useState(false);
  const [alertStatus, setAlertStatus] = useState('');
  const [alertText, setAlertText] = useState('');
  const [validated, setValidated] = useState(false);

  const responseErrorMessage = (text) => {
    setAlertStatus('danger');
    setAlertText(text);
    setShowAlert(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      createTopicService(name, selectedColor, thumbnailURL)
        .then((response) => {
          if (response.status === 201) {
            setValidated(true);

            setAlertStatus('success');
            setAlertText('Téma bylo úspěšně vytvořené');
            setShowAlert(true);

            setName('');
            setThumbnailURL('');

            setValidated(false);

            setTimeout(() => {
              setAlertStatus('');
              setAlertText('');
              setShowAlert(false);
            }, TIME_OUT_RESPONSE);
          } else {
            setValidated(false);
            responseErrorMessage('Prosíme, zkontaktujte administrátora aplikace');
          }
        })
        .catch((error) => {
          setValidated(false);
          if (error.response.status === 409) responseErrorMessage('Téma už existuje');
          else responseErrorMessage('Prosíme, zkontaktujte administrátora aplikace');
        });
    }
  };

  const handleColorChange = ({ hex }) => setSelectedColor(hex);

  return (
    <>
      {showAlert && (
        <Alert variant={alertStatus} className="mt-5" onClose={() => setShowAlert(false)} dismissible>
          {alertText}
        </Alert>
      )}

      <Row>
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="mb-5">
          <h1 className="custom-title">Vytvořit Téma</h1>

          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group className="mb-4" controlId="formBasicName">
              <Form.Label>Název tématu</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Napište název tématu"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <Form.Control.Feedback type="invalid">Zadejte Název Tématu</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicThumbnail">
              <Form.Label>URL úvodního obrázku pro Téma</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Napište URL úvodního obrázku pro Téma"
                value={thumbnailURL}
                onChange={(event) => setThumbnailURL(event.target.value)}
              />
              <Form.Control.Feedback type="invalid">Zadejte URL úvodního obrázku pro Téma</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="formBasicDescription">
              <Form.Label>Vyberte barvu pro Téma</Form.Label>
              <BlockPicker
                color={selectedColor}
                triangle="hide"
                colors={PICKER_COLORS}
                onChangeComplete={handleColorChange}
              />
            </Form.Group>

            <div className="d-grid gap-2 pt-3">
              <Button variant="primary" size="lg" type="submit" className="create-video__button">
                Vytvořit Topic
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default TopicCreate;
