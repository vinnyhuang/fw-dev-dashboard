import React, { Component } from 'react';

export default class Log extends Component {
  render() {
    return (
      <div className="status">
        <div className="title">
          <strong>{ this.props.name }</strong>
        </div>
        <div className="container">
          <div className="bigStatusContainer">
            { this.props.data }
          </div>
        </div>
        <div className="handle">
          <div className="handleIcon"/>
        </div>
      </div>
    )
  }
}