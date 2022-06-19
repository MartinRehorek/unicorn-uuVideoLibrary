import React, { useEffect, useMemo, useState } from 'react';

import { getUser, loginService } from 'services/user/user';
import { COOKIES_TOKEN, EXPIRATION, ROLES } from 'utils/constants';
import { saveUserToStorage, getUserFromStorage, removeUserFromStorage } from 'utils/auth';

let AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(null);
  const [initializing, setInitializing] = useState(true);
  const authenticated = useMemo(() => user !== null, [user]);
  const isAdmin = useMemo(() => authenticated && user?.role?.name === ROLES.admin, [authenticated]);

  const initAuth = () => (getUserFromStorage() ? getUser() : Promise.resolve(null));

  const signOut = () => {
    if (user) {
      removeUserFromStorage();

      return initAuth()
        .then((response) => {
          setUser(response?.data ? response.data : response);

          return 'logged out';
        })
        .catch((e) => Promise.reject(e));
    }
  };

  const signIn = (username, password) =>
    loginService(username, password).then((response) => {
      if (response?.data.token) {
        if (process.env.NODE_ENV === 'development') {
          // Cookies only for LocalDevelopment
          saveUserToStorage(response.data.token);
        } else {
          // Cookies for Production
          saveUserToStorage(response.data.token, {
            path: '/',
            expires: EXPIRATION,
            domain: COOKIES_TOKEN.domain,
            sameSite: 'Strict',
            secure: true,
          });
        }

        initAuth()
          .then((response) => setUser(response?.data ? response.data : response))
          .catch(() => signOut());
      }

      return response;
    });

  useEffect(() => {
    initAuth()
      .then((response) => setUser(response?.data ? response.data : response))
      .catch(() => setUser(null))
      .finally(() => setInitializing(false));
  }, []);

  let value = { user, isAdmin, authenticated, initializing, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => React.useContext(AuthContext);
