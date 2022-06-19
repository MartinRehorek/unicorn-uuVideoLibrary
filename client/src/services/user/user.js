import Client from 'services/client/client';

const getUser = () =>
  Client({
    url: `current-user`,
  });

const loginService = (username, password) =>
  Client({
    url: 'login',
    method: 'POST',
    data: {
      username,
      password,
    },
  });

const signUpService = (username, password, email, role) =>
  Client({
    url: `user`,
    method: 'post',
    data: {
      username,
      password,
      email,
      role,
    },
  })
    .then(
      () =>
        // TODO: check response type and depends on thet return true or false and make it works with route
        true,
    )
    .catch(() => false);

export { loginService, signUpService, getUser };
