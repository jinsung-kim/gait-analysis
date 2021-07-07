import React, { Component } from "react";
import axios from "axios";

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
          gaitVelocityLeft: data["left"]["gait_velocity"],
          gaitVelocityRight: data["right"]["gait_velocity"],
          strideLengthLeft: data["left"]["stride_length"],
          stridgeLengthRight: data["right"]["stride_length"],
          stepRateLeft: data["left"]["step_rate"],
          stepRateRight: data["right"]["step_rate"],
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
                  right={ this.state.gaitVelocityRight }
        />
        <BoxPlot  title="Stride Length" 
                  left={ this.state.strideLengthLeft }
                  right={ this.state.strideLengthRight }
        />
        <BoxPlot  title="Step Rate" 
                  left={ this.state.stepRateLeft }
                  right={ this.state.stepRateRight }
        />
      </div>
    );
  }
}

export default App;
