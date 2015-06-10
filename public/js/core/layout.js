import React from 'react';
import Router from 'react-router';
import {Row, Navbar} from 'react-bootstrap';
var {RouteHandler} = Router;

// import Menu from '../Components/Menu';

class App extends React.Component {
  render() {
    return (
      <div>
        <Navbar brand='Wikilist Tester'/>
        <div className='container'>
          <Row>
            <RouteHandler/>
          </Row>
        </div>
      </div>
    );
  }
}

module.exports = App;
