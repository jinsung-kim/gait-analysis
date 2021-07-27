import React, { Component } from "react";
import axios from "axios";
// import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';

// import BoxPlot from "./components/BoxPlot";
import HeatMap from "./components/HeatMap";

import './App.css';

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
      stepRateRight: [],
      data: []
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
          // Stride length values
          strideLengthLeft: data["left"]["stride_length"],
          strideLengthRight: data["right"]["stride_length"],
          // Step rate values
          stepRateLeft: data["left"]["step_rate"],
          stepRateRight: data["right"]["step_rate"],
        });
      })
      // If there are issues with CORS
      .catch(error => console.log(error));

    const url2 = "http://localhost:5000/getheat";

    axios.get(url2)
      .then(res => {
        const data = res.data;

        var d = []

        for (var i = 0; i < data.length; i++) {
          let diff = Math.abs(data[i]["left"]["cadence"]["med"] - data[i]["right"]["cadence"]["med"]);
          let dateof = data[i]["date"];
          // let date = "2021-04-04";

          d.push({ count: diff, date: dateof });
        }

        this.setState({
          data: d
        });
      })
      // If there are issues with CORS
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div>
        {/* <Container fluid>
          <Row>
            <Col>
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
            </Col>
          </Row>
        </Container> */}
        <HeatMap values={ this.state.data }/>
      </div>
    );
  }
}

export default App;
