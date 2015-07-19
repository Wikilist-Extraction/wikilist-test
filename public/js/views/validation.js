import React from 'react/addons';
import _ from 'lodash';
import {Button, Table, Glyphicon} from 'react-bootstrap';

import TypeListItem from '../components/typeListItem';

// import listStore from '../stores/listStore';
// import listActions from '../actions/listActions';

const listUrl = '/api/tfidf/';
const postUrl = '/api/evaluation';

const wikiPrefix = 'http://en.wikipedia.org/wiki/';

const Validation = React.createClass({

  getInitialState() {
    return {
      types: [],
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
      .then(json => this.setState({types: json, hasFetchedList: true}))
      .catch(error => {
        this.setState({
          hasFetchedList: true,
          hasError: true,
          errorText: error.message
        });
      });

      const evaluationUrl = postUrl + "/" + this.props.listName
      console.log(evaluationUrl)
      fetch(evaluationUrl)
        .then(response => response.json())
        .then(json => this.setState({
          approvedTypes: json.approvedTypes,
          declinedTypes: json.declinedTypes,
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

    fetch(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(postObj)
    });

    this.props.onNext();
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
            <th>tfIdf</th>
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

    return (
      <div>
        <h2><a href={wikiPrefix + listName}>{listName}</a></h2>
        {body}
        <Button className="pull-right" onClick={this.onSubmit} disabled={buttonDisabled}>Submit</Button>
      </div>
    );
  }
});

module.exports = Validation;
