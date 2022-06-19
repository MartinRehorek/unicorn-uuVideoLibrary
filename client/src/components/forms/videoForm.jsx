import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';

import CheckVideoForm from 'components/forms/checkVideoForm';
import AddEditVideoForm from 'components/forms/addEditVideoForm';

import { useIsMounted } from 'utils/hooks/useIsMounted';
import { getAllTopicsService } from 'services/topic/topic';

const VideoForm = ({ videoData, edit = false }) => {
  const [allTopics, setAllTopics] = useState([]);
  const [youtubeData, setYoutubeData] = useState([]);
  const [topicValue, setTopicValue] = useState();

  const isMounted = useIsMounted();
  useEffect(() => {
    if (isMounted) {
      let docsTopic = [];
      const fetchData = async () => {
        await getAllTopicsService().then((response) => {
          response?.data?.docs.forEach((topic, index) => {
            if (index === 0) setTopicValue(topic._id);
            docsTopic.push(
              <option value={topic._id} key={topic._id}>
                {topic.name}
              </option>,
            );
          });
          setAllTopics(docsTopic);
        });
      };

      fetchData();
    }
  }, []);

  useEffect(() => {
    if (isMounted && edit) {
      const payload = {
        originalUrl: videoData.originalUrl,
        videoChannelTitle: videoData.channelTitle,
        videoDefaultLanguage: videoData.defaultLanguage,
        videoDescription: videoData.description,
        videoDuration: videoData.duration,
        videoThumbnails: videoData.thumbnail,
        videoTitle: videoData.title,
        dataType: videoData.dataType,
        videoDocumentId: videoData?.document[0]?._id,
        videoDocumentName: videoData?.document[0]?.name,
        videoDocumentLink: videoData?.document[0]?.urlLink,
        editedVideoId: videoData._id,
      };

      setYoutubeData(payload);

      setTopicValue(videoData.topic[0].topicId._id);
    }
  }, [videoData]);

  const handleGetYoutubeData = (data) => {
    if (data) {
      setYoutubeData(data);
    }
  };

  return (
    <>
      <Row>
        <h1 className="createVideo__title">{videoData ? 'Formulář pro aktualizaci videa' : 'Formulář pro tvorbu videa'}</h1>
        {!videoData && (
          <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }}>
            <CheckVideoForm onGetYoutubeData={handleGetYoutubeData} />
          </Col>
        )}
      </Row>

      <Row>
        <Col md={{ span: 6, offset: 3 }} lg={{ span: 4, offset: 4 }} className="mb-5">
          <AddEditVideoForm youtubeData={youtubeData} allTopics={allTopics} topicValue={topicValue} edit={edit} />
        </Col>
      </Row>
    </>
  );
};

export default VideoForm;
