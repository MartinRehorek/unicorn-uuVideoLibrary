import Client from 'services/client/client';

export const addToDocumentService = (name, urlLink, videoId) =>
  Client({
    method: 'POST',
    url: `document`,
    data: {
      name,
      urlLink,
      videoId,
    },
  });

export const updateDocumentService = (id, name, urlLink) =>
  Client({
    method: 'PATCH',
    url: `document/${id}`,
    data: {
      name,
      urlLink,
    },
  });
