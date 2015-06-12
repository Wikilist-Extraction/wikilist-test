import React from 'react';
import {Table, Button} from 'react-bootstrap';

import TestResult from './testResult';

const allTestsUrl = '/api/tests';
const startTestUrl = '/api/start/';

var TestOverview = React.createClass({

  getInitialState() {
    return {
      tests: [],
      showTestResult: true,
      selectedTestId: 'tfidf'
    };
  },

  componentDidMount() {
    fetch(allTestsUrl)
      .then(response.json())
      .then(json => this.setState({tests: json}))
      .catch(error => console.log(error));
  },

  render() {
    if (this.state.showTestResult) {
      return <TestResult testId={this.state.selectedTestId}/>
    }


  }
});

export default TestOverview;
