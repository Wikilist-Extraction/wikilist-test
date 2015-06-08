import React from 'react';
import Router from 'react-router';
var {DefaultRoute, Route} = Router;

import Layout from './layout';
import Home from '../views/home';

var routes = (
  <Route name="app" path="/" handler={Layout}>
    <Route name="home" handler={Home}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

module.exports = routes;
