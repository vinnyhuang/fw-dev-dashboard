import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';

export default class Progress extends Component {
  render() {
    return (
      <div>
        <div className="progressContainer">
          <ProgressBar active now={ this.props.data } />
        </div>
        <div className="progressLabel">
          <strong>{ this.props.name + ": " + this.props.data + "%"}</strong>
        </div>
        <div className="handle">
          <div className="handleIcon"/>
        </div>
      </div>
    )
  }
}