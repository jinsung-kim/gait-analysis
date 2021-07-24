import React, { Component } from "react";
import * as d3 from "d3";

// https://github.com/petrjahoda/medium_d3/blob/master/js/homepage.js
export default class HeatMap extends Component {

    constructor(props) {
        super(props);

        this.graphRef = React.createRef();
    }

    componentDidUpdate() {
        const width = 960, height = 136, cellSize = 17;
        const color = d3.scaleQuantize()
            .domain([0, 100])
            .range(["#f3f6e7", "#e7eecf", "#dbe5b7", "#d0dd9f", "#c4d587", "#b8cd6f", "#acc457", "#a1bc3f", "#94b327", "#89ab0f"]);

        // append the svg object to the body of the page
        var svg = d3.select(this.graphRef.current)
            .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
    }

    render() {
        return (
            <div className="graph-wrapper">
                <div id="" ref={ this.graphRef }>

                </div>
            </div>
        );
    }
}