import React from 'react';
import Router from 'react-router';
import routes from './routes';
import ListActions from '../actions/listActions';

const listsUrl = '/api/lists';

fetch(listsUrl)
  .then(response => response.json())
  .then(json => {
    console.log(json);
    ListActions.updateLists(json)
  });

Router.run(routes, (Handler) => React.render(<Handler /> , document.body));
