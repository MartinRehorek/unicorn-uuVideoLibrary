import Client from '../client/client';

export const get = (limit = 10) =>
  Client({
    method: 'GET',
    url: `video/favorite/current-user`,
    params: {
      size: limit,
    },
  });

export const addToFavorites = (id) =>
  Client({
    method: 'POST',
    url: `video/favorite/${id}`,
  });

export const removeFromFavorites = (id) =>
  Client({
    method: 'DELETE',
    url: `video/favorite/${id}`,
  });

export const checkFavorites = (id) =>
  Client({
    method: 'GET',
    url: `video/favorite/${id}`,
  });
