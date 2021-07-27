import React, { Component } from "react";
// import axios from "axios";
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

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

    console.log("values");
    console.log(this.props.values);
    return (
      <div>
        <CalendarHeatmap
          startDate={ shiftDate(today, -150) }
          endDate={ today }
          values={ this.props.values }
          // values={ [
          //   { date: '2021-04-05', count: 1 },
          //   { date: '2021-03-03', count: 4 },
          //   { date: '2021-05-06', count: 2 },
          // ] }
        />
      </div>
    );
  }
}