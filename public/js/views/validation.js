import React from 'react/addons';
import _ from 'lodash';
import {Button, Table, Glyphicon, Alert} from 'react-bootstrap';

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
      declinedTypes: this.state.declinedTypes,
    };
    console.log(JSON.stringify(postObj));
    const url  = evaluationUrl + "/" + this.props.listName;
    fetch(url, {
      method: 'PUT',
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
      const typeRows = sortedTypeObjects.map(typeObject => {
        const isApproved = _.findIndex(state.approvedTypes, (uri) => uri === typeObject.typeUri) >= 0;
        const isDeclined = _.findIndex(state.declinedTypes, (uri) => uri === typeObject.typeUri) >= 0;

        return <TypeListItem
          typeObject={typeObject}
          onApprove={this.onApprovedType}
          onUnApprove={this.onUnApproveType}
          onDecline={this.onDeclineType}
          onUnDecline={this.onUnDeclineType}
          isDeclined={isDeclined}
          isApproved={isApproved}
          key={typeObject.typeUri} />;
      });
      // <th>Label</th>
      body = (
        <Table>
          <thead>
            <th>Uri</th>
            <th>count</th>
            <th></th>
            <th></th>
          </thead>
          <tbody>
            {typeRows}
          </tbody>
        </Table>
      )
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
