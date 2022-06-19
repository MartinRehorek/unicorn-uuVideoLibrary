import React from 'react';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import { useRoutes } from 'react-router-dom';

import Header from 'components/header/header';
import Body from 'components/body/body';
import routesMap from 'routes/routesMap';
import ErrorBoundary from 'components/errorBoundary/errorBoundary';
import { AuthProvider } from 'utils/hooks/useAuth';
import {AppContextProvider} from "./context/searchContext";

function App() {
  const routes = useRoutes(routesMap);

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <AppContextProvider>
            <Body>
              <Header />
              {routes}
            </Body>
          </AppContextProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
