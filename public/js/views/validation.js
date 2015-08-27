import React from 'react/addons';
import _ from 'lodash';
import {Button, Table, Glyphicon, Alert} from 'react-bootstrap';
import DBSCAN from '../lib/jDBSCAN/jDBSCAN';

import TypeListItem from '../components/typeListItem';

const listUrl = '/api/tfidf/';
const evaluationUrl = '/api/evaluation';
console.log(evaluationUrl);
const wikiPrefix = 'http://en.wikipedia.org/wiki/';

const Validation = React.createClass({

  getInitialState() {
    return {
      types: [],
      isWrongParsed: false,
      approvedTypes: [],
      declinedTypes: [],
      hasFetchedList: false,
      hasFetchedEvaluation: false,
      hasError: false,
      errorText: ''
    };
  },

  componentDidMount() {
    const tfIdfUrl = listUrl + this.props.listName;
    fetch(tfIdfUrl)
      .then(response => response.json())
      // .then(json => json.filter())
      .then(json => this.setState({types: json, hasFetchedList: true}))
      .catch(error => {
        this.setState({
          hasFetchedList: true,
          hasError: true,
          errorText: error.message
        });
      });

      const url = evaluationUrl + "/" + this.props.listName;
      fetch(url)
        .then(response => response.json())
        .then(json => this.setState({
          approvedTypes: json.approvedTypes,
          declinedTypes: json.declinedTypes,
          isWrongParsed: json.isWrongParsed,
          hasFetchedEvaluation: true,
        }))
        .catch(error => {
          this.setState({
            hasFetchedEvaluation: true,
            hasError: true,
            errorText: error.message
          })
        })
  },

  onApprovedType(typeUri) {
    const newState = React.addons.update(this.state, {
      approvedTypes : {
        $push : [typeUri]
      }
    });

    this.setState(newState);
  },

  onUnApproveType(typeUri) {
    const index = this.state.approvedTypes.indexOf(typeUri);
    const newState = React.addons.update(this.state, {
      approvedTypes : {
        $splice : [[index, 1]]
      }
    });

    this.setState(newState);
  },

  onDeclineType(typeUri) {
    const newState = React.addons.update(this.state, {
      declinedTypes : {
        $push : [typeUri]
      }
    });

    this.setState(newState);
  },

  onUnDeclineType(typeUri) {
    const index = this.state.declinedTypes.indexOf(typeUri);
    const newState = React.addons.update(this.state, {
      declinedTypes : {
        $splice : [[index, 1]]
      }
    });

    this.setState(newState);
  },

  onSubmit() {
    const postObj = {
      listId: this.props.listName,
      approvedTypes: this.state.approvedTypes,
      declinedTypes: this.state.declinedTypes
    };
    console.log(JSON.stringify(postObj));

    fetch(evaluationUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postObj)
    });

    this.props.onNext();
  },

  putCorrectnessState(isWrongParsed) {
    const postObj = {
      isWrongParsed: isWrongParsed
    };

    const url  = evaluationUrl + "/" + this.props.listName;

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postObj)
    }).then(response => response.json())
      .then(json => console.log(json));
  },

  onParsedWrong() {
    this.putCorrectnessState(true);
    this.setState({isWrongParsed: true});
  },

  onParsedCorrect() {
    this.putCorrectnessState(false);
    this.setState({isWrongParsed: false});
  },

  render() {
    const state = this.state;
    const types = state.types;
    const listName = this.props.listName;

    console.log(state);

    let body;
    let buttonDisabled = true;
    if (state.hasError) {
      body = <p>An error occured: {state.errorText}</p>
    } else if (state.hasFetchedList && state.hasFetchedEvaluation) {

      const sortedTypeObjects = _.sortByOrder(state.types, 'tfIdf', false);

      // helper
      const buildDistribution = (amount, values, count, mean, stdDeviation) => {
        return _.reduce(values, (acc,  score) => {
          if ((score < mean + amount * stdDeviation) && (score > mean - amount * stdDeviation)) {
            return acc + 1 / count;
          }

          return acc;
        }, 0) * 100;
      }

      // tf-idf
      const tfIdfMean = _.reduce(state.types, (acc, type) => { return acc + type.tfIdf / state.types.length; }, 0);
      const stdDeviationTfIdf = Math.sqrt( _.reduce(state.types, (acc, type) => { return acc + Math.pow((type.tfIdf - tfIdfMean), 2) / state.types.length; }, 0) );

      const withinStdDeviationTfIdf = buildDistribution(1, _.pluck(state.types, 'tfIdf'), state.types.length, tfIdfMean, stdDeviationTfIdf);
      const within2StdDeviationTfIdf = buildDistribution(2, _.pluck(state.types, 'tfIdf'), state.types.length, tfIdfMean, stdDeviationTfIdf);

      // distances
      let distanceSum = 0;
      let distances = [];
      for (let i = 1; i < state.types.length; i++) {
        console.log(sortedTypeObjects[i].tfIdf);
        const distance = sortedTypeObjects[i-1].tfIdf - sortedTypeObjects[i].tfIdf;
        distanceSum += distance;
        distances.push(distance);
      }
      const distanceMean = distanceSum / (state.types.length - 1);

      let varianceDistance = 0;
      for (let i = 1; i < state.types.length; i++) {
        const distance = sortedTypeObjects[i-1].tfIdf - sortedTypeObjects[i].tfIdf;
        varianceDistance += Math.pow(distance - distanceMean, 2) / (state.types.length - 1);
      }
      const stdDeviationDistance = Math.sqrt(varianceDistance);

      const withinStdDeviationDistance = buildDistribution(1, distances, state.types.length - 1, distanceMean, stdDeviationDistance);
      const within2StdDeviationDistance = buildDistribution(2, distances, state.types.length - 1, distanceMean, stdDeviationDistance);

      // dbscan
      let points = _(sortedTypeObjects)
        .pluck('tfIdf')
        .map((score) => { return { x: score, y: 0 }; })
        .value();

      let dbscanner = DBSCAN()
        .eps(stdDeviationTfIdf*1.2)
        .minPts(1)
        .distance('EUCLIDEAN')
        .data(points);

      const pointsInCluster = dbscanner();
      console.log('Variance', varianceDistance);
      console.log('Points', points);
      console.log('Distances', distances);
      console.log('Clustered Points', pointsInCluster);
      console.log('Clusters', dbscanner.getClusters());

      // build rows
      const typeRows = sortedTypeObjects.map((typeObject, index) => {
        const isApproved = _.findIndex(state.approvedTypes, (uri) => uri === typeObject.typeUri) >= 0;
        const isDeclined = _.findIndex(state.declinedTypes, (uri) => uri === typeObject.typeUri) >= 0;
        const deviationFromTfIdfMean = typeObject.tfIdf - tfIdfMean;

        let deviationFromDistanceMean = null;
        if (index + 1 < state.types.length) {
          deviationFromDistanceMean = (sortedTypeObjects[index+1].tfIdf - typeObject.tfIdf) - distanceMean;
        }

        return <TypeListItem
          typeObject={typeObject}
          onApprove={this.onApprovedType}
          onUnApprove={this.onUnApproveType}
          onDecline={this.onDeclineType}
          onUnDecline={this.onUnDeclineType}
          isDeclined={isDeclined}
          isApproved={isApproved}
          key={typeObject.typeUri}
          deviationTfIdf={deviationFromTfIdfMean}
          deviationDistance={deviationFromDistanceMean}
          inCluster={pointsInCluster[index] <= 1}/>;
      });
      // <th>Label</th>
      body = (
        <div>
          <div class="header-row">
            <p><strong>TfIdf</strong> Mean: {tfIdfMean}</p>
            <p>Standard Deviation: {stdDeviationTfIdf}</p>
            <p>Distribution within one Standard Deviation: {parseInt(withinStdDeviationTfIdf*100) / 100}%</p>
            <p>Distribution within two Standard Deviation: {parseInt(within2StdDeviationTfIdf*100) / 100}%</p>
            <p></p>
            <p><strong>Distance</strong> Mean: {distanceMean}</p>
            <p>Standard Deviation: {stdDeviationDistance}</p>
            <p>Distribution within one Standard Deviation: {parseInt(withinStdDeviationDistance*100) / 100}%</p>
            <p>Distribution within two Standard Deviation: {parseInt(within2StdDeviationDistance*100) / 100}%</p>
          </div>
          <Table>
            <thead>
              <th>Uri</th>
              <th>count</th>
              <th>tfIdf</th>
              <th>Deviation from TfIdf Mean</th>
              <th>Deviation from Distance Mean</th>
              <th></th>
              <th></th>
            </thead>
            <tbody>
              {typeRows}
            </tbody>
          </Table>
        </div>
      );
      buttonDisabled = false;
    } else {
      body = <p>Fetching types...</p>
    }

    const alert =
      <Alert bsStyle="danger">
        This list got probably parsed wrong!
        <Button onClick={this.onParsedCorrect}>Was Parsed Correctly!</Button>
      </Alert>;
    const wrongParsedButton = <Button className="pull-right" onClick={this.onParsedWrong}>List is wrong parsed!</Button>;


    return (
      <div>
        <h2><a href={wikiPrefix + listName}>{listName}</a></h2>
        {this.state.isWrongParsed ? alert : wrongParsedButton}
        {body}
        <Button className="pull-right" onClick={this.onSubmit} disabled={buttonDisabled}>Submit</Button>
      </div>
    );
  }
});

module.exports = Validation;
