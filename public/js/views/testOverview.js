'use strict';

import React from 'react';
import {Table, Button} from 'react-bootstrap';

import TestResult from './testResult';

const allTestsUrl = '/api/tests';
const startTestUrl = '/api/test/start/';

var TestOverview = React.createClass({

  getInitialState() {
    return {
      tests: [],
      showTestResult: false,
      selectedTestId: ''
    };
  },

  componentDidMount() {
    fetch(allTestsUrl)
      .then(response => response.json())
      .then(json => this.setState({tests: json}))
      .catch(error => console.log(error));
  },

  startTest(name) {
    fetch(startTestUrl + name)
      .then(response => console.log(response))
      .catch(error => console.log(error));
  },

  showResultFor(name) {
    this.setState({
      showTestResult: true,
      selectedTestId: name
    });
  },

  showOverview() {
    this.setState({showTestResult: false});
  },

  render() {
    if (this.state.showTestResult) {
      return <TestResult testId={this.state.selectedTestId} onGoBack={this.showOverview} />
    }

    const rows = this.state.tests.map(testName => {
      // <td><Button onClick={() => this.startTest(testName)}>Start</Button></td>
      return (
        <tr key={testName}>
          <td>{testName}</td>
          <td><Button onClick={() => this.showResultFor(testName)}>Results</Button></td>
        </tr>
      );
    });

    return (
      <Table>
        <thead>
          <th>Name</th>
          <th></th>
          <th></th>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </Table>
    )

  }
});

export default TestOverview;
