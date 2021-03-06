/** @jsxImportSource @emotion/react */

import React, { useState, useEffect } from 'react';
import { Alert, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import { TIME_OUT_RESPONSE } from 'utils/constants';
import { useIsMounted } from 'utils/hooks/useIsMounted';
import { createVideoService, updateVideoService } from 'services/admin/admin';
import { addToDocumentService, updateDocumentService } from 'services/document/document';

const AddEditVideoForm = ({ youtubeData, topicValue, allTopics, edit }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [originalTitle, setOriginalTitle] = useState('');
  const [originURL, setOriginURL] = useState('');
  const [thumbnailURL, setThumbnailURL] = useState('');
  const [description, setDescription] = useState('');
  const [channelTitle, setChannelTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [defaultLanguage, setDefaultLanguage] = useState('');
  const [dataType, setDataType] = useState();
  const [topics, setTopics] = useState('');

  const [editedVideoId, setEditedVideoId] = useState('');

  const [videoDocumentId, setVideoDocumentId] = useState('');
  const [videoDocumentName, setVideoDocumentName] = useState('');
  const [videoDocumentLink, setVideoDocumentLink] = useState('');

  const [validated, setValidated] = useState(false);
  const [alertStatus, setAlertStatus] = useState('');
  const [alertText, setAlertText] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const isMounted = useIsMounted();
  useEffect(() => {
    if (isMounted && youtubeData.length != 0) {
      setTitle(youtubeData.videoTitle);
      setOriginalTitle(youtubeData.videoTitle);
      setDescription(youtubeData.videoDescription);
      setThumbnailURL(youtubeData.videoThumbnails.url);
      setChannelTitle(youtubeData.videoChannelTitle);
      setDuration(youtubeData.videoDuration);
      setDefaultLanguage(youtubeData.videoDefaultLanguage);
      setOriginURL(youtubeData.originalUrl);
      setDataType(youtubeData?.dataType ?? 'Video');
      setVideoDocumentId(youtubeData?.videoDocumentId ?? '');
      setVideoDocumentName(youtubeData?.videoDocumentName ?? '');
      setVideoDocumentLink(youtubeData?.videoDocumentLink ?? '');
      setEditedVideoId(youtubeData?.editedVideoId ?? '');
      setTopics(topicValue);
    }
  }, [youtubeData]);

  const resetForm = (text, edit) => {
    setValidated(true);
    setAlertStatus('success');
    setAlertText(text);
    setShowAlert(true);

    setTimeout(() => {
      setValidated(false);

      setTitle('');
      setOriginalTitle('');
      setDescription('');
      setThumbnailURL('');
      setChannelTitle('');
      setDuration('');
      setDefaultLanguage('');
      setOriginURL('');
      setTopics('');

      setVideoDocumentName('');
      setVideoDocumentLink('');

      setShowAlert(false);

      if (edit) {
        navigate(`/watch/${editedVideoId}`);
      }
    }, TIME_OUT_RESPONSE);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    if (form.checkValidity() === true) {
      if (edit) {
        updateVideoService(editedVideoId, title, originalTitle, description, channelTitle, dataType, topics)
          .then(() => {
            if (videoDocumentId) {
              const name = videoDocumentName;
              const urlLink = videoDocumentLink;

              updateDocumentService(videoDocumentId, name, urlLink)
                .then(() => {
                  resetForm('Video bylo ??sp????n?? zaktualizov??no', true);
                })
                .catch((error) => {
                  setValidated(false);
                  setAlertStatus('danger');
                  setAlertText(error.response.data?.message ?? 'N??co je ??patn??');
                  setShowAlert(true);
                });
            }
            if (videoDocumentName && videoDocumentLink) {
              const name = videoDocumentName;
              const urlLink = videoDocumentLink;

              addToDocumentService(name, urlLink, editedVideoId)
                .then(() => {
                  resetForm('Video bylo ??sp????n?? zaktualizov??no', true);
                })
                .catch((error) => {
                  setValidated(false);
                  setAlertStatus('danger');
                  setAlertText(error.response.data?.message ?? 'N??co je ??patn??');
                  setShowAlert(true);
                });
            }

            resetForm('Video bylo ??sp????n?? zaktualizov??no', true);
          })
          .catch((error) => {
            setValidated(false);
            setAlertStatus('danger');
            setAlertText(error.response.data?.message ?? 'N??co je ??patn??');
            setShowAlert(true);
          });
      } else {
        createVideoService(
          title,
          originalTitle,
          originURL,
          thumbnailURL,
          description,
          channelTitle,
          duration,
          defaultLanguage ?? 'en',
          dataType,
          topics,
        )
          .then((response) => {
            if (videoDocumentName && videoDocumentLink) {
              const videoId = response.data.id;

              const name = videoDocumentName;
              const urlLink = videoDocumentLink;

              addToDocumentService(name, urlLink, videoId)
                .then(() => {
                  resetForm('Video bylo ??sp????n?? vytvo??eno');
                })
                .catch((error) => {
                  setValidated(false);
                  setAlertStatus('danger');
                  setAlertText(error.response.data?.message ?? 'N??co je ??patn??');
                  setShowAlert(true);
                });
            }

            resetForm('Pros??me, zkontaktujte administr??tora aplikace');
          })
          .catch((error) => {
            setValidated(false);
            setAlertStatus('danger');
            setAlertText(error.response.data?.message ?? 'N??co je ??patn??');
            setShowAlert(true);
          });
      }
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicTitle">
          <Form.Label>N??zev</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Napi??te n??zev"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Form.Control.Feedback type="invalid">Zadejte n??zev</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicThumbnail">
          <Form.Label>URL ??vodn??ho obr??zku</Form.Label>
          <Form.Control required type="text" placeholder="Thumbnail URL" value={thumbnailURL} disabled />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDescription">
          <Form.Label>Popisek</Form.Label>
          <Form.Control
            required
            type="text"
            as="textarea"
            rows="10"
            placeholder="Napi??te popisek"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Form.Control.Feedback type="invalid">Zadejte Popisek</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicChannelTitle">
          <Form.Label>N??zev kan??lu</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Napi??te n??zev kan??lu"
            value={channelTitle}
            onChange={(event) => setChannelTitle(event.target.value)}
          />
          <Form.Control.Feedback type="invalid">Zadejte N??zev Kan??lu</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDefaultLanguage">
          <Form.Label>Jazyk</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Napi??te jazyk"
            value={defaultLanguage?.toUpperCase() ?? 'en'}
            disabled
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicDataType">
          <Form.Label>Vyberte typ</Form.Label>
          <Form.Control
            as="select"
            value={dataType}
            onChange={(event) => {
              setDataType(event.target.value);
            }}
            required
            className="mb-3">
            <option value="Video">Video</option>
            <option value="Podcast">Podcast</option>
          </Form.Control>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicTopics">
          <Form.Label>Vyberte t??ma</Form.Label>
          <Form.Select required placeholder="Topics" value={topics} onChange={(event) => setTopics(event.target.value)}>
            {allTopics}
          </Form.Select>

          <Form.Control.Feedback type="invalid">Vyberte T??ma</Form.Control.Feedback>
        </Form.Group>

        <hr />

        {/* TODO: create add dynamic fields for video documents */}
        <Form.Group className="mb-3" controlId="formBasicChannelTitle">
          <Form.Label>Jm??no dokumentu</Form.Label>
          <Form.Control
            type="text"
            placeholder="Napi??te jm??no dokumentu"
            value={videoDocumentName}
            onChange={(event) => setVideoDocumentName(event.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicChannelTitle">
          <Form.Label>URL adresa dokumentu</Form.Label>
          <Form.Control
            type="text"
            placeholder="Napi??te URL dokumentu"
            value={videoDocumentLink}
            onChange={(event) => setVideoDocumentLink(event.target.value)}
          />
        </Form.Group>

        <div className="d-grid gap-2 pt-4">
          <Button variant="primary" size="lg" type="submit" className="create-video__button">
            {edit ? 'Upravit video' : 'Vytvo??it video'}
          </Button>
        </div>
      </Form>

      {showAlert && (
        <Alert variant={alertStatus} className="mt-5" onClose={() => setShowAlert(false)} dismissible>
          {alertText}
        </Alert>
      )}
    </>
  );
};

export default AddEditVideoForm;
