import React, { Component } from 'react';
import ReactGridLayout from 'react-grid-layout';
import { Well, Panel, ProgressBar } from 'react-bootstrap';

const divStyle = { margin: '0 20px' }

export default class App extends Component {
  // componentWillMount: function() {
  //   port = 9839  // This should be changed somehow to reflect input
  //   var host = "127.0.0.1";
  //   var socket = SocketIOClient("http://" + host + ":" + port + "/dashboard");

  //   socket.on("event", function(event) {
  //     dashboard.setData(event);
  //   });
  // },

  render() {
    return (
      <div>
        <ReactGridLayout className="layout" cols={12} rowHeight={30} width={1200}>
          <div key="log" style={ divStyle } data-grid={{ x: 0, y: 0, w: 8, h: 5 }}>
            <Well bsSize="lg">log</Well>
          </div>
          <div key="lint" data-grid={{ x: 0, y: 5, w: 5, h: 5 }}>
            <Well bsSize="lg">lint</Well>
          </div>
          <div key="test" data-grid={{ x: 5, y: 5, w: 5, h: 5 }}>
            <Well bsSize="lg">test</Well>
          </div>
          <div key="operation" data-grid={{ x: 8, y: 0, w: 2, h: 1 }}>
            <Panel header="operation">
              operation
            </Panel>
          </div>
          <div key="progress" data-grid={{ x: 8, y: 1, w: 2, h: 1 }}>
            <Panel header="progress">
              <ProgressBar active now={50}/>
              <div>50%%%</div>
            </Panel>
          </div>
          <div key="build-status" data-grid={{ x: 8, y: 2, w: 2, h: 1 }}>
            <Panel header="build-status">
              build-status
            </Panel>
          </div>
          <div key="lint-status" data-grid={{ x: 8, y: 3, w: 2, h: 1 }}>
            <Panel header="lint-status">
              lint-status
            </Panel>
          </div>
          <div key="test-status" data-grid={{ x: 8, y: 4, w: 2, h: 1 }}>
            <Panel header="test-status">
              test-status
            </Panel>
          </div>
        </ReactGridLayout>
      </div>
    )
  }
}