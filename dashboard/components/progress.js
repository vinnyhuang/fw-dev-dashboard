import React, { Component } from 'react';
import { ProgressBar } from 'react-bootstrap';

export default class Progress extends Component {
  render() {
    return (
      <div className="progressBar">
        <div className="title">
          <strong>{ this.props.name }</strong>
        </div>
        <div className="container">
          <div className="progressPercent">
            { this.props.data + "%"}
          </div>
          <div className="barContainer">
            <ProgressBar active now={ this.props.data } />
          </div>
        </div>
        <div className="handle">
          <div className="handleIcon"/>
        </div>
      </div>
    )
  }
}