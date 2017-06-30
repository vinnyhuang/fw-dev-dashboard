import React, { Component } from 'react';
import ansiHTML from 'ansi-html';
import Parser from 'html-react-parser';

export default class Log extends Component {
  render() {
    return (
      <div>
        <div className="title">
          <strong>{ this.props.name }</strong>
        </div>
        <div className="logContainer">
          { this.props.data.replace(/ /g, "\u00a0").split('\n').map((line, index) => (
            line === "" ? <p key={ index }><br /></p> : <p key={ index }>{ Parser(ansiHTML(line)) }</p>)
          ) }
        </div>
        <div className="handle">
          <div className="handleIcon"/>
        </div>
      </div>
    )
  }
}