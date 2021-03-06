import React from 'react';
import {ListGroupItem, Button} from 'react-bootstrap';

const ExploreListItem = React.createClass({

  getInitialState() {
    return {
      isApproved: false,
      isDeclined: false
    };
  },

  componentDidMount() {
    this.setState({
      isApproved: this.props.isApproved,
      isDeclined: this.props.isDeclined
    })
  },

  handleOnClickApprove() {
    if (this.state.isDeclined) {
      return;
    }

    const isApproved = !this.state.isApproved;
    const typeUri = this.props.typeObject.typeUri;

    if (isApproved) {
      this.props.onApprove(typeUri);
    } else {
      this.props.onUnApprove(typeUri);
    }

    this.setState({isApproved: isApproved});
  },

  handleOnClickDecline() {
    if (this.state.isApproved) {
      return;
    }

    const isDeclined = !this.state.isDeclined;
    const typeUri = this.props.typeObject.typeUri;

    if (isDeclined) {
      this.props.onDecline(typeUri);
    } else {
      this.props.onUnDecline(typeUri);
    }

    this.setState({isDeclined: isDeclined});
  },

  render() {
    const typeObj = this.props.typeObject;
    const approveButtonName = 'Approve';
    const declineButtonName = 'Decline';

    // const approveButtonName = this.state.isApproved ? 'UnApprove' : 'Approve';
    // const declineButtonName = this.state.isDeclined ? 'UnDecline' : 'Decline';

    const approveButtonStyle = this.state.isApproved ? 'success' : 'default';
    const declineButtonStyle = this.state.isDeclined ? 'danger' : 'default';

    // <td>{typeObj.label}</td>
    return (
      <tr className={this.props.inCluster ? 'inCluster' : ''}>
        <td><a href={typeObj.typeUri} target='_blank'>{typeObj.typeUri}</a></td>
        <td>{typeObj.count}</td>
        <td>{typeObj.tfIdf}</td>
        <td>{this.props.deviationTfIdf}</td>
        <td>{this.props.deviationDistance}</td>
      </tr>
    );
  }
});

module.exports = ExploreListItem;
