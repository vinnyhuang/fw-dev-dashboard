import React, { Component } from 'react';
import ReactGridLayout from 'react-grid-layout';
import SocketIOClient from 'socket.io-client';
import ansiHTML from 'ansi-html';
import dragIcon from '../images/cursor-move-black.png';
import Log from './log.js';
import Status from './status.js';
import Progress from './progress.js';
import { logElements, statusElements, progressElements } from '../../config/dashboard.config.js';

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
    const port = 9839;  // This should be changed somehow to reflect input
    const host = "127.0.0.1";
    const socket = SocketIOClient("http://" + host + ":" + port + "/dashboard");
    const that = this;

    socket.on("event", function(message) {
      // console.log(message);

      // const newState = {};
      // Object.keys(message).forEach((key) => {
      //   if (message[key] !== that.state[key]) { newState[key] = message[key]; }
      // });
      // that.setState(newState);

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
          { 
            logElements.map((rule, index) => {
              return (<div key={ rule.key } className="logBox box" data-grid={ rule.startParams }>
                        <Log  name={ rule.name } 
                              data={ (rule.replaceRules ? rule.replaceRules : [])
                                      .reduce((data, replaceRule) => {
                                        return data.replace(replaceRule.from, replaceRule.to);
                                      }, this.state[rule.stateProp])
                                    }
                        />
                      </div>)
            })
          }

          {
            statusElements.map((rule, index) => {
              return (<div key={ rule.key } className="statusBox box" data-grid={ rule.startParams }>
                        <Status name={ rule.name } 
                                data={ this.state[rule.stateProp] }
                        />
                      </div>)
            })
          }

          {
            progressElements.map((rule, index) => {
              return (<div key={ rule.key } className="progressBox box" data-grid={ rule.startParams }>
                        <Progress name={ rule.name }
                                  data={ this.state[rule.stateProp] }
                        />
                      </div>)
            })
          }
        </ReactGridLayout>
      </div>
    )
  }
}