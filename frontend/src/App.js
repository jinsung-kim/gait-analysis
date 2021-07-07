import React, { Component } from "react";
import * as d3 from "d3";
import axios from "axios";

import './App.css';

// Gets the critical data points and returns them in an array to be used
// as the component
function getCritical(data, key) {
  var q1 = d3.quantile(data, .25);
  var median = d3.quantile(data, .5);
  var q3 = d3.quantile(data, .75);
  var interQuantileRange = q3 - q1;
  var min = q1 - 1.5 * interQuantileRange;
  var max = q1 + 1.5 * interQuantileRange;

  return ({
          q1: q1, median: median, q3: q3, 
          interQuantileRange: interQuantileRange, 
          min: min, max: max, key: key
          });
}

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

        var margin = {top: 10, right: 30, bottom: 30, left: 40},
            width = 460 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(this.myRef.current)
          .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        
        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        var p1 = getCritical(this.state.gaitVelocityLeft, "Left");
        var p2 = getCritical(this.state.gaitVelocityRight, "Right");
        console.log(p1);
        console.log(p2);
        var sumstat = [p1, p2];

        // Show the X scale
        var x = d3.scaleBand()
          .range([ 0, width ])
          .domain(["Left", "Right"])
          .paddingInner(1)
          .paddingOuter(.5)
        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))

        // Show the Y scale
        var y = d3.scaleLinear()
          .domain([1.3, 1.8])
          .range([height, 0])
        svg.append("g").call(d3.axisLeft(y))

        // Show the main vertical line
        svg
          .selectAll("vertLines")
          .data(sumstat)
          .enter()
          .append("line")
            .attr("x1", function(d) { return(x(d.key)) })
            .attr("x2", function(d) { return(x(d.key)) })
            .attr("y1", function(d) { return(y(d.min)) })
            .attr("y2", function(d) { return(y(d.max)) })
            .attr("stroke", "black")
            .style("width", 40)

        // rectangle for the main box
        var boxWidth = 100
        svg
          .selectAll("boxes")
          .data(sumstat)
          .enter()
          .append("rect")
            .attr("x", function(d) { return(x(d.key) - boxWidth / 2) })
            .attr("y", function(d) { return(y(d.q3)) })
            .attr("height", function(d) { return(y(d.q1) - y(d.q3)) })
            .attr("width", boxWidth )
            .attr("stroke", "black")
            .style("fill", "#69b3a2")

        // Show the median
        svg
          .selectAll("medianLines")
          .data(sumstat)
          .enter()
          .append("line")
            .attr("x1", function(d) { return(x(d.key) - boxWidth / 2) })
            .attr("x2", function(d) { return(x(d.key) + boxWidth / 2) })
            .attr("y1", function(d) { return(y(d.median)) })
            .attr("y2", function(d) { return(y(d.median)) })
            .attr("stroke", "black")
            .style("width", 80)
          })
      // If there are issues with CORS
      .catch(error => console.log(error));
  }

  render() {
    return (
      <div className="app">
        <div id="box-plot" ref={ this.myRef }>
        </div>
      </div>
    );
  }
}

export default App;
