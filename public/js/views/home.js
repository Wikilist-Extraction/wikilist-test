import React from 'react';

const listsUrl = '/api/lists';

class Home extends React.Component {

  getInitialState() {
    return {
      lists: []
    };
  }

  componentDidMount() {
    fetch(listsUrl)
      .then((response) => console.log(response))
  }

  render() {
    return (
      <div>
        Requesting Lists
      </div>
    );
  }
}

module.exports = Home;
