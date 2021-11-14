// https://www.d3-graph-gallery.com/graph/boxplot_basic.html
import React, { Component } from "react";
import * as d3 from "d3";

import "../styles/BoxPlot.css";

export default class BoxPlot extends Component {

    constructor(props) {
        super(props);
        this.graphRef = React.createRef();
    }

    componentDidUpdate() {
        var margin = {top: 10, right: 30, bottom: 30, left: 40},
            width = 350 - margin.left - margin.right,
            height = 400 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select(this.graphRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                  "translate(" + margin.left + "," + margin.top + ")");
        
        // Compute quartiles, median, inter quantile range min and max --> these info are then used to draw the box.
        const left = this.props.left;
        const right = this.props.right;

        var sumstat = [left, right];

        if (this.props.left === undefined || this.props.right === undefined) {
            return 
        }
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
          .domain(["left", "right"])
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
        // Need to make sure that this is done first so that the box
        // overlays on this line
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
        var boxWidth = 100;
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

        // Left min and max lines
        svg
            .selectAll("toto")
            .data([left.min, left.max])
            .enter()
            .append("line")
            .attr("x1", boxWidth / 2 - 30)
            .attr("x2", boxWidth / 2 + 70)
            .attr("y1", function(d) { return(y(d))} )
            .attr("y2", function(d) { return(y(d))} )
            .attr("stroke", "black")

        // Right min and max lines
        svg
            .selectAll("toto")
            .data([right.min, right.max])
            .enter()
            .append("line")
            .attr("x1", width - 120)
            .attr("x2", width - 20)
            .attr("y1", function(d) { return(y(d))} )
            .attr("y2", function(d) { return(y(d))} )
            .attr("stroke", "black")
    }

    render() {
        if (this.props.left === undefined) {
            return (
                <div className="graph-wrapper">
                <h2 className="title">Loading...</h2>
            </div>
            )
        }
        return (
            <div className="graph-wrapper">
                <h2 className="title">{ this.props.title }</h2>
                <div id="box-plot" ref={ this.graphRef }>
                
                </div>
            </div>
        );
    }
}