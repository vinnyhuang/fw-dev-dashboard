import React, { Component } from 'react';
import ReactGridLayout from 'react-grid-layout';
import { Well, Panel, ProgressBar } from 'react-bootstrap';
import SocketIOClient from 'socket.io-client';
// import Convert from 'ansi-to-html';
import ansiHTML from 'ansi-html';
import dragIcon from './images/cursor-move-black.png';

// var convert = new Convert();

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      progress: 0,
      operations: "",
      buildLog: "",
      lintLog: "",
      testLog: "",
      buildStatus: "",
      lintStatus: "",
      testStatus: ""
    }
  }

  componentWillMount() {
    var port = 9839;  // This should be changed somehow to reflect input
    var host = "127.0.0.1";
    var socket = SocketIOClient("http://" + host + ":" + port + "/dashboard");
    var that = this;

    socket.on("event", function(message) {
      console.log(message);
      that.setState({
        progress: message.progress,
        operations: message.operations,
        buildLog: message.buildLog,
        lintLog: message.lintLog,
        testLog: message.testLog,
        buildStatus: message.buildStatus,
        lintStatus: message.lintStatus,
        testStatus: message.testStatus
      });
    });
  }

  render() {
    // const buildLogParagraphs = this.state.buildLog.split('\n').map((line) => (<p>{ line }</p>));
    // console.log(buildLogParagraphs);
    return (
      <div>
        <ReactGridLayout className="layout" cols={12} rowHeight={30} width={1200} verticalCompact={ false } draggableCancel=".logContainer" draggableHandle=".handle" >
          <div key="log" className="logBox" data-grid={{ x: 0, y: 0, w: 8, h: 5}}>
            <div className="logContainer">
              { this.state.buildLog.replace(/ /g, "\u00a0").split('\n').map((line, index) => (<p key={ index }>{ line === "" ? <br /> : line }</p>)) }
            </div>
            <div className="handle">
              <div className="handleIcon"/>
            </div>
          </div>
          <div key="lint" className="logBox" data-grid={{ x: 0, y: 5, w: 5, h: 5 }}>
            <div className="logContainer">
              { this.state.lintLog.replace(/ /g, "\u00a0").split('\n').map((line, index) => (line === "" ? <p key={ index }><br /></p> : <p key={ index } dangerouslySetInnerHTML={{__html: ansiHTML(line)}} />)) }
            </div>
            <div className="handle">
              <div className="handleIcon"/>
            </div>
          </div>
          <div key="test" className="logBox" data-grid={{ x: 5, y: 5, w: 5, h: 5 }}>
            <div className="logContainer">
              {
                this.state.testLog.replace(/\n[\s]*(\d)/g, function(match, p1) { return  '\n  ' + p1 })
                                  .replace(/\n[\s]*at/g, '\n    at')
                                  .replace(/ /g, "\u00a0")
                                  .split('\n').map((line, index) => (<p key={ index } dangerouslySetInnerHTML={{__html: line === "" ? '<br />' : ansiHTML(line)}}></p>))
              }
            </div>
            <div className="handle">
              <div className="handleIcon"/>
            </div>
          </div>
          <div key="operation" className="statusBox" data-grid={{ x: 8, y: 0, w: 2, h: 1 }}>
            { this.state.operations }
          </div>
          <div key="progress" className="statusBox" data-grid={{ x: 8, y: 1, w: 2, h: 1 }}>
            <div className="progressDiv">
              <ProgressBar active now={ this.state.progress }/>
            </div>
            { this.state.progress }
          </div>
          <div key="build-status" className="statusBox" data-grid={{ x: 8, y: 2, w: 2, h: 1 }}>
            { this.state.buildStatus} 
          </div>
          <div key="lint-status" className="statusBox" data-grid={{ x: 8, y: 3, w: 2, h: 1 }}>
            { this.state.lintStatus }
          </div>
          <div key="test-status" className="statusBox" data-grid={{ x: 8, y: 4, w: 2, h: 1 }}>
            { this.state.testStatus }
          </div>
        </ReactGridLayout>
      </div>
    )
  }
}