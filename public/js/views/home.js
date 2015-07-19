import React from 'react';
import {Glyphicon, ButtonGroup, Button, DropdownButton, MenuItem, Input} from 'react-bootstrap';
import Validation from './validation';


const listsUrl = '/api/lists';

const Home = React.createClass({

  getInitialState() {
    return {
      lists: [],
      hasFetched: false,
      currentListNumber: 0
    };
  },

  componentDidMount() {
    fetch(listsUrl)
      .then(response => response.json())
      .then(json => this.setState({lists: json, hasFetched: true}))
      .catch(error => console.log(error));
  },

  onNext() {
    const currentListNumber = this.state.currentListNumber;
    this.setState({currentListNumber: currentListNumber + 1});
  },

  onPrevious() {
    const currentListNumber = this.state.currentListNumber;
    this.setState({currentListNumber: currentListNumber - 1});
  },

  isFirst() {
    return this.state.currentListNumber == 0;
  },

  isLast() {
    return this.state.currentListNumber == this.state.lists.length - 1;
  },

  selectList(index) {
    this.setState({currentListNumber: index});
  },


  render() {
    // const listElems = this.state.lists.map((listString) => {
    //     return <ListItem listName={listString} key={listString}/>
    // });
    const lists = this.state.lists;
    const currentListNumber = this.state.currentListNumber;


    let element;
    if (currentListNumber >= lists.length) {
      element = <p>Validation finished</p>
    } else if (this.state.hasFetched) {
      const listName = lists[currentListNumber];

      const dropdownItems = lists.map((elem, index) => {
        return <MenuItem onSelect={() => this.selectList(index)} eventKey={index}>{`${index} ${elem}`}</MenuItem>
      })

      const currentListNumberValueLink = {
        value: currentListNumber,
        requestChange: this.selectList
      }

      element = (
        <div>
          <ButtonGroup>
            <Button onClick={this.onPrevious} disabled={this.isFirst()}><Glyphicon glyph='arrow-left' /></Button>
            <Button onClick={this.onNext} disabled={this.isLast()}><Glyphicon glyph='arrow-right' /></Button>
            <DropdownButton bsStyle='default' title='choose list' key={this.state.currentListNumber}>
              {dropdownItems}
            </DropdownButton>
            <Input type="number" valueLink={currentListNumberValueLink}/>
          </ButtonGroup>
          <Validation listName={listName} onNext={this.onNext} key={listName}/>
        </div>
      )
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
