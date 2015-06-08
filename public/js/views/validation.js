import React from 'react';
import {Button} from 'react-bootstrap';

// import listStore from '../stores/listStore';
// import listActions from '../actions/listActions';

const listUrl = '/api/tfidf/';

const Validation = React.createClass({

  getInitialState() {
    return {
      types: []
    };
  },

  componentDidMount() {
    const url = listUrl + this.props.listName;
    fetch(url)
      .then(response => response.json())
      .then(json => {
        console.log("json", json);
        this.setState({types: json})
        })
      .catch(error => console.log(error));
  },

  onSubmit() {
    // post result
    this.props.onNext();
  },

  render() {
    const types = this.state.types;
    const listName = this.props.listName;

    console.log(types);
    const listTypes = null;

    return (
      <div>
        <h2>{listName}</h2>
        {listTypes}
        <Button onClick={this.onSubmit}>Submit</Button>
      </div>
    );
  }
});

module.exports = Validation;
