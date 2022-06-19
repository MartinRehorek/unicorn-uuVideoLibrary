import React, { useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';

import { getAllVideosService } from 'services/video/video';
import VideoItem from 'components/videoItem/videoItem';

import { useIsMounted } from 'utils/hooks/useIsMounted';

const Suggestions = ({ count = 10, topic, title }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSuggestions = (count, title, topic) => {
    getAllVideosService(0, count, title, topic)
      .then((response) => {
        setSuggestions(response?.data.docs);
      })
      .finally(() => setLoading(false));
  };

  const hasSuggestions = () => typeof suggestions.length !== 'undefined' && suggestions.length > 0;

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) {
      getSuggestions(count, title, topic);
    }
  }, [count, topic]);

  return (
    <>
      {loading && <Spinner className={'suggestions__loader'} animation="border" />}
      {!loading && hasSuggestions() && (
        <div className="video__sugestions">
          {suggestions.map((suggestion, index) => (
            <VideoItem item={suggestion} key={`suggestion-${index}`} />
          ))}
        </div>
      )}
      {!loading && !hasSuggestions() ? (
        <div className="suggestions__notFound">
          <i className="fa-solid fa-file-circle-xmark suggestions__notFound-icon"></i>
          <span>Nebyl nalezen žádný obsah</span>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Suggestions;
