import React from 'react';
import _ from 'lodash';
import {Button, Table, Glyphicon, Panel, Badge, ListGroup, ListGroupItem, Col, Row} from 'react-bootstrap';
import {ButtonLink} from 'react-router-bootstrap';

const testResultUrl = '/api/test/result/';
const wikiPrefix = 'http://en.wikipedia.org/wiki/';

const TestResult = React.createClass({

  getInitialState() {
    return {
      showResult: false,
      showResultId: '',
      fetchedResults: false,
      testResults: [],
      testResultsFiltered: [],
      showFiltered: false
    }
  },

  componentDidMount() {
    fetch(testResultUrl + this.props.testId)
      .then(response => response.json())
      .then(json => this.setState({
        testResults: json.all,
        testResultsFiltered: json.filtered
      }))
      .catch(error => console.log(error));
  },

  getMatches(arr1, arr2) {
    const intersection = _.intersection(arr1, arr2);
    return intersection.length;
  },

  getTestResultRow(testResult) {

    const numOfDeclined = testResult.declinedTypes.length;
    const numOfApproved = testResult.approvedTypes.length;

    const numOfApprovedMatches = this.getMatches(testResult.approvedTypes, testResult.result);
    const numOfDeclinedMatches = this.getMatches(testResult.declinedTypes, testResult.result);;

    const approvedStyle = numOfApprovedMatches < numOfApproved ? 'danger' : 'default';
    const declinedStyle = numOfDeclinedMatches > 0 ? 'danger' : 'default';

    return (
      <tr>
        <td><a href={wikiPrefix + testResult.listId}>{testResult.listId}</a></td>
        <td><Badge className={'alert-'+approvedStyle}>{`${numOfApprovedMatches} / ${numOfApproved}`}</Badge></td>
        <td><Badge className={'alert-'+declinedStyle}>{`${numOfDeclinedMatches} / ${numOfDeclined}`}</Badge></td>
        <td><Button onClick={() => this.openResults(testResult.listId)}>Details</Button></td>
      </tr>
    )
  },

  openResults(listId) {
    this.setState({
      showResult: true,
      showResultId: listId
    });
  },

  showAllResults() {
    this.setState({showResult: false});
  },

  getList(array, getStyle) {
    const elems = array.map(elem => {
      const style = getStyle(elem);
      return <ListGroupItem bsStyle={style}><a href={elem}>{elem}</a></ListGroupItem>;
    });
    return (
      <ListGroup>
        {elems}
      </ListGroup>
    )
  },

  toggleShowFiltered() {
    this.setState((prevState, props) => {
      return { showFiltered: !prevState.showFiltered };
    });
  },

  render() {
    const testResults = this.state.showFiltered ? this.state.testResultsFiltered : this.state.testResults;
    const filterButtonText = this.state.showFiltered ? "Show UnFiltered" : "Show Filtered";

    if ('status' in testResults) {
      return (
        <div>
          <Button onClick={this.props.onGoBack}>Back</Button>
          <Panel header={testResults.status}>
            {testResults.message}
          </Panel>
        </div>
      );
    }

    let body;
    if (!this.state.showResult) {
      const filteredTestResults = testResults.filter(testResult => testResult.declinedTypes.length > 0 || testResult.approvedTypes.length > 0)
      const testResultRows = filteredTestResults.map(testResult => this.getTestResultRow(testResult));

      const matchSum = filteredTestResults.reduce(((acc, testResult) => testResult.approvedTypes.length + acc), 0)
      const actualMatches = filteredTestResults.reduce(((acc, testResult) => this.getMatches(testResult.approvedTypes, testResult.result) + acc), 0)
      const matchPercent =  matchSum > 0 ? actualMatches / matchSum : 0

      const mismatchSum = filteredTestResults.reduce(((acc, testResult) => testResult.declinedTypes.length + acc), 0)
      const actualMismatches = filteredTestResults.reduce(((acc, testResult) => this.getMatches(testResult.declinedTypes, testResult.result) + acc), 0)
      const mismatchPercent =  mismatchSum > 0 ? (actualMismatches / mismatchSum) : 0

      // get this with sumApprovedTypesQuery.js
      const summedApprovedTypes = 2581
      // number of lists we created the dump from
      const numberOfAllLists = 2000

      const precision = actualMatches / (actualMismatches + actualMatches)
      const recall = actualMatches / (actualMatches + summedApprovedTypes)
      const listRate = filteredTestResults.length / numberOfAllLists

      body = (
        <div>
          <Button onClick={this.props.onGoBack}>Back</Button>
          <span>Precision: <strong>{precision}</strong>   </span>
          <span>Recall: <strong>{recall}</strong>   </span>
          <span>Lists with result rate: {listRate}  </span>
          <Button onClick={this.toggleShowFiltered}>{filterButtonText}</Button>
          <Table hover>
            <thead>
              <th>List</th>
              <th>Match ({matchPercent*100}%)</th>
              <th>Mismatch ({mismatchPercent*100}%)</th>
              <th></th>
            </thead>
            <tbody>
              {testResultRows}
            </tbody>
          </Table>
        </div>
      );
    } else {
      const id = this.state.showResultId;
      const result = _.find(testResults, (result) => result.listId == id);

      function getApprovedStyle(elem) {
        if(!_.includes(result.result, elem)) {
          return 'warning';
        } else {
          return 'default';
        }
      }

      function getDeclinedStyle(elem) {
        if(_.includes(result.result, elem)) {
          return 'danger';
        } else {
          return 'default';
        }
      }

      function getResultStyle(elem) {
        return 'default';
      }

      const approvedTypesList = this.getList(result.approvedTypes, getApprovedStyle);
      const declinedTypesList = this.getList(result.declinedTypes, getDeclinedStyle);
      const testResultList = this.getList(result.result, getResultStyle);
      body = (
        <div>
          <Button onClick={this.showAllResults}>Back</Button>
          <h2><a href={wikiPrefix + id}>{id}</a></h2>
          <ButtonLink to="exploreWithListId" params={{listId: id}}>Show Explore Page</ButtonLink>
          <Row>
            <Col sm={6}>
              <h3>Approved Types</h3>
              {approvedTypesList}
              <h3>Declined Types</h3>
              {declinedTypesList}
            </Col>
            <Col sm={6}>
              <h3>Computed Types</h3>
              {testResultList}
            </Col>
          </Row>
        </div>
      )
    }

    return body;
  }
});

module.exports = TestResult;
