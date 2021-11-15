import React, { Component } from "react";

import "../src/App.css";
import axios from "axios";
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

import BoxPlot from "./components/graphs/BoxPlot";
import HeatMap from "./components/graphs/HeatMap";
import Header from "./components/Header";

import './App.css';

// https://medium.com/@varvara.munday/d3-in-react-a-step-by-step-tutorial-cba33ce000ce
class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gaitVelocityLeft: [],
      gaitVelocityRight: [],
      strideLengthLeft: [],
      strideLengthRight: [],
      stepRateLeft: [],
      stepRateRight: [],
      data: [],
      sessionId: 0,
      availableIds: [],
      boxReady: false,
      heatReady: false,
    };
  }

  componentDidMount() {
    const url = "http://localhost:5000/getbox";
    const params = {
      "id": 383850
    }
    axios.post(url, params)
      .then(res => {
        const data = res.data;

        this.setState({
          // Gait Velocity values
          gaitVelocityLeft: data["left"]["gait_velocity"],
          gaitVelocityRight: data["right"]["gait_velocity"],
          // Stride length values
          strideLengthLeft: data["left"]["stride_length"],
          strideLengthRight: data["right"]["stride_length"],
          // Step rate values
          stepRateLeft: data["left"]["step_rate"],
          stepRateRight: data["right"]["step_rate"],
          boxReady: true,
        });
      })
      // If there are issues with CORS
      .catch(error => console.log(error));

    const url2 = "http://localhost:5000/getheat";

    axios.get(url2)
      .then(res => {
        const data2 = res.data;

        var d = []

        for (var i = 0; i < data2.length; i++) {
          let diff = Math.abs(data2[i]["val"]) * 100;
          let dateof = data2[i]["date"];
          // let date = "2021-04-04";

          d.push({ count: diff, date: dateof });
        }

        console.log(d);

        this.setState({
          data: d,
          heatReady: true,
        });
      })
    .catch(error => console.log(error)); // If there are issues with CORS
  }

  handleChange = (e) => {
    this.setState({ 
      sessionId: e.target.value
    });
  }

  render() {
    if (!this.state.boxReady && !this.state.heatReady) { return null; }
    return (
      <div style={{  
        padding: "30px"
      }}>
        <Header />
        <div style={{  
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr"
        }}>
          <BoxPlot  title="Gait Velocity" 
              left={ this.state.gaitVelocityLeft }
              right={ this.state.gaitVelocityRight }
          />
          <BoxPlot  title= "Stride Length" 
              left={ this.state.strideLengthLeft }
              right={ this.state.strideLengthRight }
          />
          <BoxPlot  title="Step Rate" 
              left={ this.state.stepRateLeft }
              right={ this.state.stepRateRight }
          />
        </div>
        <HeatMap values={ this.state.data }/>
      </div>
    );
  }
}

export default App;
