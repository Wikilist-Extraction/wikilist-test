import React from 'react';

import Validation from './validation';
// import {ListGroup, Button} from 'react-bootstrap';
// import ListItem from '../components/listItem';
// import {ButtonLink} from 'react-router-bootstrap';
// import ReactStateMagicMixin from "alt/mixins/ReactStateMagicMixin.js";

// import ListStore from '../stores/listStore';
// import ListActions from '../actions/listActions';

const listsUrl = '/api/lists';

const Home = React.createClass({

  // mixins : [ReactStateMagicMixin],
  //
  // statics : {
  //   registerStore: ListStore
  // },

  getInitialState() {
    return {
      lists: [],
      hasFetched: false,
      currentList: 0
    };
  },

  componentDidMount() {
    fetch(listsUrl)
      .then(response => response.json())
      .then(json => this.setState({lists: json, hasFetched: true}));
  },

  onNext() {
    const currentListNumber = this.state.currentListNumber;
    this.setState({currentListNumber: currentListNumber + 1});
  },

  render() {
    // const listElems = this.state.lists.map((listString) => {
    //     return <ListItem listName={listString} key={listString}/>
    // });
    const lists = this.state.lists;
    const currentList = this.state.currentList;

    let element;
    if (currentList >= lists.length) {
      element = <p>Validation finished</p>
    } else if (this.state.hasFetched) {
      element = <Validation listName={lists[currentList]} onNext={this.onNext}/>
    } else {
      element = <p>Fetching lists</p>
    }

    return (
      <div>
        {element}
      </div>
    );
  }
});

module.exports = Home;
