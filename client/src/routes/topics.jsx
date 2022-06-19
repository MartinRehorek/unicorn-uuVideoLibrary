/** @jsxImportSource @emotion/react */

import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { useNavigate, useOutletContext } from 'react-router-dom';

import RemoveTopic from 'components/topic/removeTopic';

import { getAllTopicsService } from 'services/topic/topic';
import { useIsMounted } from 'utils/hooks/useIsMounted';

const Topics = () => {
  const [[, setPageTitle]] = useOutletContext();
  const navigate = useNavigate();

  const [topics, setTopics] = useState();
  const [loading, setLoading] = useState(true);

  const isMounted = useIsMounted();
  useEffect(() => {
    if (isMounted) {
      setPageTitle('Témata');

      const fetchData = async () => {
        /* eslint-disable  */
        await loadTopics();
        /* eslint-enable  */
      };

      fetchData();
    }
  }, [loading]);

  const handleDeleteTopic = (props) => {
    if (props) setLoading(true);
  };

  const loadTopics = async () => {
    await getAllTopicsService()
      .then((response) => {
        const docs = [];

        response?.data?.docs.forEach((topic) => {
          docs.push(
            <Col key={`topic-${topic._id}`} md={{ span: 2 }} lg={{ span: 4 }}>
              <Card className="topics__card">
                <div>
                  <Card.Img
                    variant="top"
                    src={topic.thumbnail.url}
                    className="topics__card-img"
                    onClick={() => navigate(`/topic/${topic._id}`)}
                  />
                </div>

                <Card.Body className="pt-4 pb-4 topics__title">
                  <h3>{topic.name}</h3>
                  <RemoveTopic id={topic._id} onHandleDeleteTopic={handleDeleteTopic} />
                </Card.Body>
              </Card>
            </Col>,
          );
        });

        setTopics(docs);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <h1>Témata</h1>
      {!loading && <Row>{topics}</Row>}
    </>
  );
};

export default Topics;
