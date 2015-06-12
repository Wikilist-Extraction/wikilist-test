import React from 'react';
import Router from 'react-router';
var {DefaultRoute, Route} = Router;

import Layout from './layout';
import Home from '../views/home';
import TestOverview from '../views/testOverview';

var routes = (
  <Route name="app" path="/" handler={Layout}>
    <Route name="home" handler={Home}/>
    <Route name="testing" handler={TestOverview}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

module.exports = routes;
