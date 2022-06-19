/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { Card, Container, Row, Col } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import Slider from 'react-slick';

import podcastImg from 'assets/img/podcastImg.svg';
import videoImg from 'assets/img/videoImg.svg';

import { useIsMounted } from 'utils/hooks/useIsMounted';
import { getAllVideosService } from 'services/video/video';
import TopicItem from 'components/topic/topicItem';

const settingsOfCarousel = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  responsive: [
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        infinite: true,
        dots: true,
      },
    },
  ],
};

const Home = () => {
  const [[, setPageTitle]] = useOutletContext();
  const [videos, setVideos] = useState();
  const [podcasts, setPodcasts] = useState();

  const isMounted = useIsMounted();
  useEffect(() => {
    if (isMounted) {
      setPageTitle('Pojď se učit s námi!');
      getAllVideosService(0, 9, null, null, 'Video').then((response) => {
        const docsVideos = [];
        response?.data?.docs.forEach((video, index) => {
          docsVideos.push(<TopicItem className="video__home--slider-item" video={video} key={`video-${index}`} />);
        });
        setVideos(docsVideos);
      });

      getAllVideosService(0, 9, null, null, 'Podcast').then((response) => {
        const docsPodcasts = [];
        response?.data?.docs.forEach((video, index) => {
          docsPodcasts.push(<TopicItem className="video__home--slider-item" video={video} key={`podcast-${index}`} />);
        });
        setPodcasts(docsPodcasts);
      });
    }
  }, []);

  return (
    <>
      <Container>
        <Row>
          <Col xs={12}>
            <h1 className="home__title">
              Vítej v <span className="text-primary">uuVideo Library</span>! <br />
              Co si chceš dnes pustit?
            </h1>

            <Row>
              <Col xs={12}>
                <Row>
                  <Col xs={12} md={6} lg={3}>
                    <Card className="home__card">
                      <Card.Img variant="top" src={podcastImg} alt="Podcasts" className="home__card__img" />
                      <Card.Body>
                        <Card.Text className="home__card__text">PODCAST</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={12} md={6} lg={9}>
                    <Slider {...settingsOfCarousel}>{podcasts}</Slider>
                  </Col>
                </Row>
              </Col>

              <Col xs={12}>
                <Row>
                  <Col xs={12} md={6} lg={3}>
                    <Card className="home__card">
                      <Card.Img variant="top" src={videoImg} alt="Videos" className="home__card__img" />
                      <Card.Body>
                        <Card.Text className="home__card__text">VIDEOS</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col xs={12} md={6} lg={9}>
                    <Slider {...settingsOfCarousel}>{videos}</Slider>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
