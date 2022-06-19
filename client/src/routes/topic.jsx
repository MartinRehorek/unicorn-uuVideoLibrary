import React, { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { get } from 'services/topic/topic';
import TopicItem from '../components/topic/topicItem';
import NotFound from './notFound';

const Topic = () => {
  const [[pageTitle, setPageTitle]] = useOutletContext();
  const { topic } = useParams();
  const [loading, setLoading] = useState(true);
  const [topicData, setTopicData] = useState(null);
  const [videos, setVideos] = useState([]);

  const getVideos = () =>
    get(topic)
      .then((response) => {
        if (!pageTitle) {
          setPageTitle(response?.data.name);
        }

        setTopicData(response?.data);
      })
      .catch((e) => console.log(e)) // TODO: fix all error response
      .finally(() => setLoading(false));

  useEffect(() => {
    if (topic) {
      getVideos();
    }
  }, []);

  useEffect(() => {
    if (topicData) {
      const videosTemp = [...videos];
      topicData.video.forEach(({ videoId }) => {
        videosTemp.push(<TopicItem video={videoId} sm={6} md={4} xl={3} />);
      });
      setVideos(videosTemp);
    }
  }, [topicData]);

  return (
    <React.Fragment>
      {!loading && topicData && (
        <React.Fragment>
          <h1>{topicData?.name}</h1>
          <Row>{videos}</Row>
        </React.Fragment>
      )}
      {!loading && !topicData && <NotFound />}
    </React.Fragment>
  );
};

export default Topic;
