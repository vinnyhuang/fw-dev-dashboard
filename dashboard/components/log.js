import React, { Component } from 'react';
import ansiHTML from 'ansi-html';
import Parser from 'html-react-parser';


ansiHTML.setColors({
  reset: ['#ECEFF4', '#4C566A'], // FOREGROUND-COLOR or [FOREGROUND-COLOR] or [, BACKGROUND-COLOR] or [FOREGROUND-COLOR, BACKGROUND-COLOR] 
  black: '#2E3440', // String 
  red: '#BF616A',
  green: '#A3BE8C',
  yellow: '#EBCB8B',
  blue: '#5E81AC',
  magenta: '#B48EAD',
  cyan: '#88C0D0',
  lightgrey: '#D8DEE9',
  darkgrey: '#4C566A'
});

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