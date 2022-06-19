import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { Badge, Row, Col, ListGroup } from 'react-bootstrap';

import { getVideoService } from 'services/video/video';
import YoutubePlayer from 'components/youtubePlayer/youtubePlayer';
import Suggestions from 'components/sugestions/sugestions';
import SetFavorite from 'components/setFavorite/setFavorite';
import RemoveItem from 'components/videoItem/removeItem';
import EditItem from 'components/videoItem/edit';
import NotFound from './notFound';
import { useAuth } from 'utils/hooks/useAuth';
import { useIsMounted } from 'utils/hooks/useIsMounted';

const Video = () => {
  const { video } = useParams();

  const [[, setPageTitle]] = useOutletContext();

  const [loading, setLoading] = useState(true);
  const [videoData, setVideoData] = useState(null);

  const { authenticated, isAdmin } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const getVideo = () => {
    getVideoService(video)
      .then((response) => {
        setPageTitle(response?.data.title);
        setVideoData(response?.data);
      })
      .finally(() => setLoading(false));
  };

  const isMounted = useIsMounted();
  useEffect(() => {
    if (isMounted && video) {
      getVideo();
    }

    return () => {
      setLoading(true);
    };
  }, [location]);

  return (
    <>
      {!loading && videoData && (
        <Row>
          <Col lg={8} xl={9} className="mb-5">
            <YoutubePlayer
              className="video__single-player"
              videoId={videoData.originURL.replace(/^.*v=(\w+).*$/, '$1')}
            />

            <div className={'video__single-body'}>
              <div className={'video__single-head'}>
                <div className={'video__single-badges'}>
                  <Badge className={'video__datatype me-1'}>{videoData.dataType}</Badge>
                  {videoData.topic.map((tag, index) => (
                    <Badge
                      className={'video__topic'}
                      key={`badge-${index}`}
                      onClick={() => navigate(`/${tag.topicId._id}`)}
                      bg="secondary">
                      {tag.topicId.name}
                    </Badge>
                  ))}
                </div>
                <div className={'video__single-actions'}>
                  {isAdmin && <EditItem id={videoData._id} videoData={videoData} />}
                  {isAdmin && <RemoveItem id={videoData._id} />}
                </div>
              </div>

              <h1>{videoData.title}</h1>
              {authenticated && <SetFavorite id={videoData._id} />}

              <hr />

              <h4>Popis</h4>
              <p>{videoData.description}</p>
            </div>
          </Col>

          <Col lg={4} xl={3} className="pt-1">
            {videoData?.document?.length > 0 && (
              <>
                <h4>Soubory ke stažení</h4>
                <ListGroup className={'my-3'}>
                  {videoData.document.map((file, index) => (
                    <ListGroup.Item
                      className={'video__single-fileList-item'}
                      key={`file-${index}`}
                      onClick={() => window.open(file.urlLink, '_blank')}>
                      <i className="fa-solid fa-file"></i> {file.name}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            )}
            <h4>Další doporučený obsah</h4>
            <Suggestions topic={videoData.topic} title={videoData.title} count={6} />
          </Col>
        </Row>
      )}
      {!loading && !videoData && <NotFound />}
    </>
  );
};

export default Video;
