import React, { Component } from 'react';
import ansiHTML from 'ansi-html';
import Parser from 'html-react-parser';

ansiHTML.setColors({
  reset:    ['111111','ffffff'],
  black:     '111111',
  white:     'ffffff',
  red:       'ff4136',
  green:     '2ecc40',
  yellow:    'ffdc00',
  blue:      '0074d9',
  magenta:   'f012be',
  cyan:      '7fdbff',
  lightgray: 'dddddd',
  darkgray:  'aaaaaa'
})

export default class Log extends Component {
  render() {
    return (
      <div className="log">
        <div className="title">
          <strong>{ this.props.name }</strong>
        </div>
        <div className="container">
          { this.props.data.replace(/ /g, "\u00a0").split('\n').map((line, index) => (
            line === "" ? <p key={ index }><br /></p> : <p key={ index } dangerouslySetInnerHTML={{ __html: ansiHTML(line) }} />
          )) }
        </div>
        <div className="handle">
          <div className="handleIcon"/>
        </div>
      </div>
    )
  }
}