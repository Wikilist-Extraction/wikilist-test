import React from 'react';

const listsUrl = '/api/lists';

const Home = React.createClass({

  getInitialState() {
    return {
      lists: []
    };
  },

  componentDidMount() {
    fetch(listsUrl)
      .then((response) => console.log(response))
  },

  render() {
    return (
      <div>
        Requesting Lists
      </div>
    );
  }
});

module.exports = Home;
