import React from 'react';

import Home from './home';
import Topic from './topic';
import Login from './login';
import NotFound from './notFound';
import Page from './page';
import SignUp from './signUp';
import Topics from './topics';
import Video from './video';
import VideoEdit from './videoEdit';
import VideoCreate from './videoCreate';
import Favorites from './favorites';
import SearchVideos from './search';
import TopicCreate from './topicCreate';
import ProtectedRoute from 'components/protectedRoute/protectedRoute';
import AdminRoute from 'components/adminRoute/adminRoute';
import Logout from './logout';

const routesMap = [
  {
    title: 'Home',
    key: 'home',
    element: <Page />,
    children: [
      {
        title: 'Home',
        key: 'home',
        path: '/',
        element: <Home title={'Pojď se učit s námi!'} />,
      },
      {
        title: 'Searching',
        key: 'search/:value',
        path: 'search',
        element: <SearchVideos />,
      },
      {
        title: 'Topics',
        path: 'topics',
        element: <Topics />,
      },
      {
        title: 'Topic',
        path: 'topic/:topic',
        element: <Topic />,
      },
      {
        title: 'Topic',
        path: 'admin/topic/create',
        element: <TopicCreate />,
      },
      {
        title: 'Video',
        path: 'watch/:video',
        element: <Video />,
      },
      {
        title: 'Login',
        path: 'login',
        key: 'login',
        element: <Login />,
      },
      {
        title: 'Signup',
        key: 'signup',
        path: 'signup',
        element: <SignUp />,
      },
      {
        title: 'ProtectedRoutes',
        element: <ProtectedRoute />,
        children: [
          {
            title: 'Favorites',
            path: 'favorites',
            element: <Favorites />,
          },
          {
            title: 'Edit Video',
            path: 'video/edit/:video',
            element: <VideoEdit />,
          },
          {
            title: 'Logout',
            path: 'logout',
            element: <Logout />,
          },
          {
            title: 'AdminRoutes',
            element: <AdminRoute />,
            children: [
              {
                title: 'Create a Video',
                key: 'videoCreat',
                path: 'admin/video/create',
                element: <VideoCreate />,
              },
            ],
          },
        ],
      },
      {
        title: 'Not Found',
        path: '*',
        key: 'not-found',
        element: <NotFound />,
      },
    ],
  },
];

export default routesMap;
