/** @jsxImportSource @emotion/react */
import React from 'react';

import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

import { HeaderNavBrandCss } from './header.styles';
import Search from 'components/search/searchbar';
import { useAuth } from 'utils/hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();
  const { authenticated, user, isAdmin } = useAuth();

  const handleSwagger = () => {
    window.open(process.env.REACT_APP_SERVER_SWAGGER, '_blank').focus();
  };

  return (
    <Navbar className={'header-navbar'} expand="lg">
      <Container>
        <Navbar.Brand>
          <Link to={'/'}>
            <img css={HeaderNavBrandCss} src="/uu_video_library_logo.png" alt="uuVideoLibrary logo" />
          </Link>
        </Navbar.Brand>
        <div className={'header__actions'}>
          {authenticated && (
            <NavDropdown
              className={'header__logged'}
              title={
                <div className={'header__logged-user'}>
                  <div className={'header__logged-user-image'}>
                    <div className={'inicial'}>{user.username[0]}</div>
                  </div>
                  <div className={'header__logged-user-name'}>{user.username}</div>
                </div>
              }
              id="collasible-nav-dropdown">
              {isAdmin && (
                <>
                  <NavDropdown.Item onClick={() => navigate('/admin/video/create')}>
                    <i className={'fa fa-plus'}></i> Přidat obsah
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={() => handleSwagger()}>
                    <i className={'fa-solid fa-book'}></i> Dokumentace
                  </NavDropdown.Item>

                  <NavDropdown.Divider />

                  <NavDropdown.Item onClick={() => navigate('/admin/topic/create')}>
                    <i className={'fa fa-plus'}></i> Přidat témata
                  </NavDropdown.Item>

                  <NavDropdown.Divider />
                </>
              )}
              <NavDropdown.Item onClick={() => navigate('/logout')}>Odhlásit se</NavDropdown.Item>
            </NavDropdown>
          )}
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
        </div>
        <Navbar.Collapse id="basic-navbar-nav">
          <Search className="header-search_input mx-auto" />
          <Nav className="ms-lg-auto">
            <Nav.Link onClick={() => navigate('/topics')}>Témata</Nav.Link>
            {!authenticated ? (
              <>
                <Button variant="link" onClick={() => navigate('/login')}>
                  Přihlášení
                </Button>
                <Button onClick={() => navigate('/signup')}>Registrace</Button>
              </>
            ) : (
              <>
                <Nav.Link onClick={() => navigate('/favorites')}>
                  <i className={'fa-regular fa-heart'}></i> Moje oblíbené
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
