import React from 'react';
import {Button} from 'react-bootstrap';

// import listStore from '../stores/listStore';
// import listActions from '../actions/listActions';

const listUrl = '/api/tfidf/';

const Validation = React.createClass({

  getInitialState() {
    return {
      types: [],
      hasFetched: false,
      hasError: false,
      errorText: ''
    };
  },

  componentDidMount() {
    console.log("new fetch");
    const url = listUrl + this.props.listName;
    fetch(url)
      .then(response => response.json())
      .then(json => this.setState({types: json, hasFetched: true}))
      .catch(error => {
        console.log(error);
        this.setState({
          hasFetched: true,
          hasError: true,
          errorText: error
        })
      });
  },

  onSubmit() {
    // post result
    this.props.onNext();
  },

  render() {
    const state = this.state;
    const types = state.types;
    const listName = this.props.listName;

    console.log(types);

    let body;
    let buttonDisabled = true;
    if (state.hasError) {
      body = <p>An error occured: {state.errorText}</p>
    } else if (state.hasFetched) {
      body = state.types
      buttonDisabled = false;
    } else {
      body = <p>Fetching types...</p>
    }

    return (
      <div>
        <h2>{listName}</h2>
        {body}
        <Button onClick={this.onSubmit} disabled={buttonDisabled}>Submit</Button>
      </div>
    );
  }
});

module.exports = Validation;
