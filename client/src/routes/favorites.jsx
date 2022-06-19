import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Row } from 'react-bootstrap';
import { get } from '../services/favorites/favorites';
import TopicItem from '../components/topic/topicItem';

const Favorites = () => {
  const [[, setPageTitle]] = useOutletContext();
  const [loading, setLoading] = useState(true);
  const [topicData, setTopicData] = useState(null);
  const [videos, setVideos] = useState([]);

  const getVideos = () =>
    get()
      .then((response) => {
        setTopicData(response?.data);
      })
      .finally(() => setLoading(false));

  useEffect(() => {
    setPageTitle('Oblíbené');
    getVideos();
  }, []);

  useEffect(() => {
    if (topicData) {
      const videosTemp = [...videos];
      topicData?.docs.forEach((videoData) => {
        let video = videoData.videos[0];
        videosTemp.push(<TopicItem video={video} sm={6} md={4} xl={3} />);
      });
      setVideos(videosTemp);
    }
  }, [topicData]);

  return (
    <React.Fragment>
      <h1>Oblíbené</h1>
      {!loading && (
        <React.Fragment>
          <h1>{topicData.name}</h1>
          <Row>{videos}</Row>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Favorites;
