import React from 'react';
import {ListGroupItem, Button} from 'react-bootstrap';

const TypeListItem = React.createClass({

  getInitialState() {
    return {
      isApproved: false
    };
  },

  handleOnClick() {
    const isApproved = !this.state.isApproved;
    const typeUri = this.props.typeObject.typeUri;

    if (isApproved) {
      this.props.onApprove(typeUri);
    } else {
      this.props.onDecline(typeUri);
    }

    this.setState({isApproved: isApproved});
  },

  render() {
    const typeObj = this.props.typeObject;
    const buttonName = this.state.isApproved ? 'Decline' : 'Approve';
    return (
      <tr>
        <td>{typeObj.label}</td>
        <td>{typeObj.typeUri}</td>
        <td>{typeObj.count}</td>
        <td>{typeObj.tfIdf}</td>
        <td><Button onClick={this.handleOnClick}>{buttonName}</Button></td>
      </tr>
    );
  }
});

module.exports = TypeListItem;
