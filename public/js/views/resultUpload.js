import React from 'react';
import {Input, ButtonInput} from 'react-bootstrap';
import Validation from './validation';


const listsUrl = '/api/lists';

const ResultUpload = React.createClass({

  render() {
    return (
      <form>
        <Input type='text' label='Test name' placeholder='Enter test name' />
        <Input type='file' label='Result file' help='TBD' />
        <ButtonInput type='submit' value='Submit' />
      </form>
    );
  }
});

module.exports = ResultUpload;
