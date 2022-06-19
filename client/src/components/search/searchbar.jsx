import React, { useState } from 'react';

import { Form, FormControl } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Search = (props) => {
  const [searchedValue, setSearchedValue] = useState('');
  const navigate = useNavigate();

  return (
    <Form className="d-flex" {...props}>
      <FormControl
        type="search"
        placeholder="Vyhledejte video nebo podcast..."
        className="me-2"
        aria-label="Search"
        value={searchedValue}
        onChange={(event) => {
          setSearchedValue(event.target.value);
        }}
        onKeyPress={(event) => {
          if (event.key === 'Enter') {
            navigate(`/search?title=${searchedValue}`);
            setSearchedValue('');
            event.preventDefault();
          }
        }}
      />
    </Form>
  );
};

export default Search;
