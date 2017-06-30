import React, { Component } from 'react';

export default class Log extends Component {
  render() {
    return (
      <div>
        <div className="statusContainer">
          <strong>{ this.props.name + ': '}</strong>
          { this.props.data }
        </div>
        <div className="handle">
          <div className="handleIcon"/>
        </div>
      </div>
    )
  }
}