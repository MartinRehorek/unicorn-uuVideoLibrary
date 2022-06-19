import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Row } from 'react-bootstrap';

import { getAllVideosService } from 'services/video/video';
import VideoItem from 'components/videoItem/videoItem';
import NotFoundComponent from 'components/notFound/notFoundComponent';

const SearchVideos = () => {
  const [searchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [videoComponentElements, setVideoComponentElements] = useState([]);

  const searchValue = searchParams.get('title');

  const getVideos = (searchedTitle) =>
    getAllVideosService(0, 1000, searchedTitle)
      .then((response) => {
        setVideos(response?.data.docs);
      })
      .catch((e) => console.log(e)); // TODO: fix all error response

  useEffect(() => {
    if (searchValue) {
      getVideos(searchValue);
    }
  }, [searchValue]);

  useEffect(() => {
    const videosTemp = [];
    videos.forEach((item) => {
      videosTemp.push(<VideoItem item={item} key={item._id} sm={6} md={4} xl={3} />);
    });
    setVideoComponentElements(videosTemp);
  }, [videos]);

  return (
    <>
      <h1>Výsledek vyhledávání pro: {searchValue}</h1>
      {videoComponentElements.length === 0 ? (
        <NotFoundComponent showButton={false} />
      ) : (
        <Row>{videoComponentElements}</Row>
      )}
    </>
  );
};
export default SearchVideos;
