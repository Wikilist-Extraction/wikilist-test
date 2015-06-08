import React from 'react';
import Router from 'react-router';
var {DefaultRoute, Route} = Router;

import Layout from './layout';
import Home from '../views/home';
import Validation from '../views/validation';

var routes = (
  <Route name="app" path="/" handler={Layout}>
    <Route name="home" handler={Home}/>
    <Route name="validation" handler={Validation}/>
    <DefaultRoute handler={Home}/>
  </Route>
);

module.exports = routes;
