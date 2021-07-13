import React, { Component } from "react";
import axios from "axios";
// import * as d3 from "d3";

import './App.css';

import BoxPlot from "./components/BoxPlot";

// https://medium.com/@varvara.munday/d3-in-react-a-step-by-step-tutorial-cba33ce000ce
class App extends Component {

  constructor(props) {
    super(props);

    // Used for D3 object
    this.myRef = React.createRef();

    this.state = {
      gaitVelocityLeft: [],
      gaitVelocityRight: [],
      strideLengthLeft: [],
      strideLengthRight: [],
      stepRateLeft: [],
      stepRateRight: []
    };
  }

  componentDidMount() {
    const url = "http://localhost:5000/getbox";

    axios.get(url)
      .then(res => {
        const data = res.data;
        this.setState({
          // Gait Velocity values
          gaitVelocityLeft: data["left"]["gait_velocity"],
          gaitVelocityRight: data["right"]["gait_velocity"],
          // gaitListLeft: data["left"]["gait_list"],
          // gaitListRight: data["right"]["gait_list"],
          // Stride length values
          strideLengthLeft: data["left"]["stride_length"],
          stridgeLengthRight: data["right"]["stride_length"],
          // strideListLeft: data["left"]["stride_list"],
          // strideListRight: data["right"]["stride_list"],
          // Step rate values
          stepRateLeft: data["left"]["step_rate"],
          stepRateRight: data["right"]["step_rate"],
          // stepListLeft: data["left"]["step_list"],
          // stepListRight: data["right"]["step_list"],
        });
      })
      // If there are issues with CORS
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="app">
        <BoxPlot  title="Gait Velocity" 
                  left={ this.state.gaitVelocityLeft }
                  // lleft={ this.state.gaitListLeft }
                  right={ this.state.gaitVelocityRight }
                  // lright={ this.state.gaitListRight }
        />
        {/* <BoxPlot  title="Stride Length" 
                  left={ this.state.strideLengthLeft }
                  lleft={ this.state.strideListLeft }
                  right={ this.state.strideLengthRight }
                  lright={ this.state.strideListRight }
        /> */}
        <BoxPlot  title="Step Rate" 
                  left={ this.state.stepRateLeft }
                  // lleft={ this.state.stepListLeft }
                  right={ this.state.stepRateRight }
                  // lright={ this.state.stepListRight }
        />
      </div>
    );
  }
}

export default App;
