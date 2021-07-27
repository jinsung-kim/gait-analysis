import React, { Component } from "react";
// import axios from "axios";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import "../styles/HeatMap.css";

// Used to get the time interval that we are looking for
// Takes in a date object and the number of days that we want to go back for
function shiftDate(date, numDays) {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numDays);
  return newDate;
}

// https://codesandbox.io/s/73mk9wlyx?file=/src/index.js
export default class HeatMap extends Component {

  constructor(props) {
    super(props);

    this.state = {}
  }

  render() {
    const today = new Date();
    return (
      <div>
        <CalendarHeatmap
          startDate={ shiftDate(today, -150) }
          endDate={ today }
          values={ this.props.values }
          // Value/count of the graph
          classForValue={ (value) => {
            if (!value) {
              return 'color-empty';
            } else if (value.count < 0.25) {
              return 'color-scale-4';
            } else if (value.count < 0.5) {
              return 'color-scale-3';
            } else if (value.count < 0.75) {
              return 'color-scale-2';
            } else {
              return 'color-scale-1';
            }
          }}
        />
      </div>
    );
  }
}