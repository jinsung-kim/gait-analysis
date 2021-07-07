// https://www.d3-graph-gallery.com/graph/boxplot_basic.html
import React, { Component } from "react";
import * as d3 from "d3";

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

export default class BoxPlot extends Component {

    constructor(props) {
        super(props);

        // Reference that points to a div to overlay the image
        this.graphRef = React.createRef();
    }

    async componentDidMount() {
        var margin = {top: 10, right: 30, bottom: 30, left: 40},
            width = 460 - margin.left - margin.right,
            height = 600 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(this.graphRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        
        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        const left = getCritical(this.props.left, "Left");
        const right = getCritical(this.props.right, "Right");
        var sumstat = [left, right];

        // Gets the min and the max between the two graphs to get the range to use as the y axis
        var localMin = Math.min(left.min, right.min);
        var localMax = Math.max(left.max, right.max);

        if (isNaN(localMin) || isNaN(localMax)) {
            localMin = 0;
            localMax = 0;
        }

        var range = (localMax - localMin) / 10;

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
          .domain([localMin - range, localMax + range])
          .range([height, 0])
        svg.append("g").call(d3.axisLeft(y))

        // Show the main vertical line (Min to Max range)
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

        // Rectangle for the main box (Q1 to Q3)
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
    }

    render() {
        return (
            <div className="graph-wrapper">
                <h2>{ this.props.title }</h2>
                <div id="box-plot" ref={ this.graphRef }>
                
                </div>
            </div>
        );
    }
}