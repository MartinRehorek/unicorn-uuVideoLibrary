import React from 'react';
import { Link, matchRoutes, useLocation } from 'react-router-dom';
import { Breadcrumb } from 'react-bootstrap';

import routesMap from 'routes/routesMap';

const CustomBreadcrumb = () => {
  const location = useLocation();
  const matchedRoutes = matchRoutes(routesMap, location);

  return (
    matchedRoutes.length > 1 &&
    location.pathname !== '/' && (
      <Breadcrumb>
        {matchedRoutes.map((path, index) => (
          <Breadcrumb.Item
            key={`breadcrumb-${index}`}
            linkAs={() => <Link to={path.pathname}>{path.route.title}</Link>}
          />
        ))}
      </Breadcrumb>
    )
  );
};

export default CustomBreadcrumb;
