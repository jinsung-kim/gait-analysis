import React, { Component } from 'react';
// import { useTheme } from '@mui/material/styles';
import { ResponsiveContainer } from 'recharts';
import Title from './Title';
// import BoxPlot from "./graphs/BoxPlot";
import TestChart from "./graphs/TestChart";

export default class Charts extends Component {

  constructor(props) {
    super(props);

    this.state = {
      gaitVelocityLeft: this.props.gaitVelocityLeft,
      gaitVelocityRight: this.props.gaitVelocityRight,
      strideLengthLeft: this.props.strideLengthLeft,
      strideLengthRight: this.props.strideLengthRight,
      stepRateLeft: this.props.stepRateLeft,
      stepRateRight: this.props.stepRateRight,
    }
  }

  render() {
    return (
      <React.Fragment>
        <Title>Most Recent Session</Title>
        <ResponsiveContainer>
          {/* <BoxPlot left={ this.state.gaitVelocityLeft }
                   right={ this.state.gaitVelocityRight }
                   title={ "Gait Velocity" }
          /> */}
          {/* <TestChart /> */}
          <p>There should be a box plot here</p>

          {/* <BoxPlot left={ this.state.strideLengthLeft }
                   right={ this.state.strideLengthRight }
                   title={ "Stride Length" }
          />

          <BoxPlot left={ this.state.stepRateLeft }
                   right={ this.state.stepRateRight }
                   title={ "Step Rate" }
          /> */}
        </ResponsiveContainer>
      </React.Fragment>
    );
  }
}