import React from 'react';
import Router from 'react-router';
<<<<<<< HEAD
import routes from './routes';
import ListActions from '../actions/listActions';

const listsUrl = '/api/lists';

fetch(listsUrl)
  .then(response => response.json())
  .then(json => {
    console.log(json);
    ListActions.updateLists(json)
  });
=======
import routes from './Routes';
>>>>>>> 4020448a04f374cb81804a665208373d4321dbf0

Router.run(routes, (Handler) => React.render(<Handler /> , document.body));
