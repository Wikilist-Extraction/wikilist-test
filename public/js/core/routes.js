import React from 'react';
import Router from 'react-router';
var {DefaultRoute, Route} = Router;

import Layout from './layout';
import Home from '../views/home';
import TestOverview from '../views/testOverview';
import ResultUpload from '../views/resultUpload';

import Validation from '../views/validation';
import Explore from '../views/explore';

var wrapComponent = function(Component, props) {
  return React.createClass({
    render: function() {
      return React.createElement(Component, props);
    }
  });
};

var routes = (
  <Route name="app" path="/" handler={Layout}>
    <Route name="home" path="/home" handler={wrapComponent(Home, { inner: Validation })}/>
    <Route name="explore" path="/explore" handler={wrapComponent(Home, { inner: Explore })}/>
    <Route name="exploreWithListId" path="/explore/:listId" handler={wrapComponent(Home, { inner: Explore })}/>
    <Route name="testing" handler={TestOverview}/>
    <Route name="upload" handler={ResultUpload}/>
    <DefaultRoute handler={wrapComponent(Home, { inner: Validation })}/>
  </Route>
);

module.exports = routes;
