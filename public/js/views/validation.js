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
      hasFetched: false,
      hasError: false,
      errorText: ''
    };
  },

  componentDidMount() {
    const url = listUrl + this.props.listName;
    fetch(url)
      .then(response => response.json())
      .then(json => this.setState({types: json, hasFetched: true}))
      .catch(error => {
        this.setState({
          hasFetched: true,
          hasError: true,
          errorText: error
        });
      });
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
    } else if (state.hasFetched) {

      const sortedTypeObjects = _.sortByOrder(state.types, 'tfIdf', false);
      const typeRows = sortedTypeObjects.map(typeObject => {
        return <TypeListItem
          typeObject={typeObject}
          onApprove={this.onApprovedType}
          onUnApprove={this.onUnApproveType}
          onDecline={this.onDeclineType}
          onUnDecline={this.onUnDeclineType}
          key={typeObject.typeUri} />;
      });
      body = (
        <Table>
          <thead>
            <th>Label</th>
            <th>Uri</th>
            <th>count</th>
            <th>tfIdf</th>
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
        <Button onClick={this.onSubmit} disabled={buttonDisabled}>Submit</Button>
      </div>
    );
  }
});

module.exports = Validation;
