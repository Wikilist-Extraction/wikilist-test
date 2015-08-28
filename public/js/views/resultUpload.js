import React from 'react';
import {Input, ButtonInput} from 'react-bootstrap';
import Validation from './validation';


const listsUrl = '/api/lists';

const ResultUpload = React.createClass({

  handleSubmit() {

  },

  render() {
    return (
      <form>
        <Input type='text' label='Algorithm name' placeholder='Enter algorithm name' />
        <Input type='file' label='Result file' help='TBD' />
        <ButtonInput type='submit' value='Submit' onClick={this.handleSubmit}/>
      </form>
    );
  }
});

module.exports = ResultUpload;
