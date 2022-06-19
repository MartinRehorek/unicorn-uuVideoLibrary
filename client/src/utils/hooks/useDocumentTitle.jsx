import { useEffect, useState } from 'react';

import { useIsMounted } from 'utils/hooks/useIsMounted';

const useDocumentTitle = (title) => {
  const [documentTitle, setDocumentTitle] = useState(title);

  const baseTitle = process.env.REACT_APP_APP_TITLE;

  const isMounted = useIsMounted();

  useEffect(() => {
    if (isMounted) document.title = documentTitle ? `${documentTitle} | ${baseTitle}` : baseTitle;
  }, [documentTitle]);

  return [documentTitle, setDocumentTitle];
};

export { useDocumentTitle };
