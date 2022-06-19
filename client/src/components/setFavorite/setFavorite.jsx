import React, {useEffect, useState} from 'react';
import {addToFavorites, checkFavorites, removeFromFavorites} from "../../services/favorites/favorites";
import {Button, Spinner} from "react-bootstrap";

const SetFavorite = ({id, showLabel = true, className, size}) => {

  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(undefined);

  const buttonTitle = isFavorite ? 'Odebrat z oblíbených' : 'Přidat mezi oblíbené';

  const handleClick = (id) => {
    setLoading(true);
    if (isFavorite) {
      removeFromFavorites(id).then((response) => {
        setIsFavorite(false);
      }).catch((e) => console.log(e))
        .finally(() => setLoading(false));
    } else {
      addToFavorites(id).then((response) => {
        setIsFavorite(true);
      }).catch((e) => console.log(e))
        .finally(() => setLoading(false));
    }
  }

  useEffect(() => {
    if (id) {
      checkFavorites(id).then((response) => {
        setIsFavorite(response?.data?.favorite);
      }).catch((e) => setIsFavorite(false))
        .finally(() => setLoading(false));
    }
  }, [id]);

  return (<Button className={className} size={size} disabled={loading} variant={isFavorite ? `primary` : `light`}
                  onClick={() => loading ? null : handleClick(id)}>
    {loading ? <Spinner animation="border" size="sm"/> : <><i
      className={`fa-solid fa-heart ${showLabel && 'me-2'}`}></i>{showLabel && buttonTitle}</>}
  </Button>)
}

export default SetFavorite;
