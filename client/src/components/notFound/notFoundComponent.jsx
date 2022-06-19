import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NotFoundComponent = ({ showButton = true }) => {
  const navigate = useNavigate();

  return (
    <div className={'not-found'}>
      <i className="fa-solid fa-person-falling not-found__icon"></i>
      <h1 className="not-found__title">Obsah nebyl nalezen.</h1>
      {showButton && (
        <>
          <p>Zkuste se vrátit na hlavní stránku.</p>
          <Button onClick={() => navigate('/')} variant={'primary'}>
            Hlavní stránka
          </Button>
        </>
      )}
    </div>
  );
};

export default NotFoundComponent;
