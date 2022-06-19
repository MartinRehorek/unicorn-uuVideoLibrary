import { Container } from 'react-bootstrap';
import React, {useEffect, useState} from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { useDocumentTitle } from 'utils/hooks/useDocumentTitle';

const Page = () => {
  const location = useLocation();
  const [pageTitle, setPageTitle] = useDocumentTitle('');
  const [mainLoading, setMainLoading] = useState(true);

  useEffect(() => () => setPageTitle(''), [location]);

  return (
    <Container className={'app-body'}>
      <Outlet context={[[pageTitle, setPageTitle]]} />
    </Container>
  );
};

export default Page;
