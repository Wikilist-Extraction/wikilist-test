import React from 'react';
import _ from 'lodash';
import {Button, Table, Glyphicon, Panel, Badge, ListGroup, ListGroupItem, Col, Row} from 'react-bootstrap';

const testResultUrl = '/api/test/result/';
const wikiPrefix = 'http://en.wikipedia.org/wiki/';

const mock = [
    {
      "listId": "List_of_Donald_Ross-designed_courses",
      "declinedTypes": [
        "http://dbpedia.org/ontology/Settlement",
        "http://dbpedia.org/ontology/City",
        "http://dbpedia.org/ontology/Town",
        "http://dbpedia.org/ontology/Village",
        "http://dbpedia.org/ontology/HistoricPlace",
        "http://dbpedia.org/ontology/Building",
        "http://dbpedia.org/ontology/ArchitecturalStructure",
        "http://dbpedia.org/ontology/School",
        "http://dbpedia.org/ontology/EducationalInstitution"
        ],
      "approvedTypes": [
        "http://dbpedia.org/ontology/PopulatedPlace",
        "http://dbpedia.org/ontology/Place",
        "http://dbpedia.org/ontology/GolfCourse",
        "http://dbpedia.org/ontology/SportFacility"
      ],
      "result": [
        "http://dbpedia.org/ontology/EducationalInstitution",
        "http://dbpedia.org/ontology/PopulatedPlace",
        "http://dbpedia.org/ontology/Place",
        "http://dbpedia.org/ontology/GolfCourse",
        "http://dbpedia.org/ontology/SportFacility"
      ]
    }
];


const TestResult = React.createClass({

  getInitialState() {
    return {
      showResult: false,
      showResultId: '',
      fetchedResults: false,
      testResults: []
    }
  },

  componentDidMount() {
    fetch(testResultUrl + this.props.testId)
      .then(response => response.json())
      .then(json => this.setState({
        testResults: json
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

  render() {
    const testResults = this.state.testResults;

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


      const precision = actualMatches / (actualMismatches + actualMatches)

      body = (
        <div>
          <Button onClick={this.props.onGoBack}>Back</Button>
          <span>Precision: {precision}</span>
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
