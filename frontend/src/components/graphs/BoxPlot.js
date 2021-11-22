// NOT USING ANYMORE: https://www.d3-graph-gallery.com/graph/boxplot_basic.html
import React, { Component } from "react";
import Chart from 'react-apexcharts';

export default class BoxPlot extends Component {

    constructor(props) {
        super(props);
        
        var l = this.props.left;
        var r = this.props.right;

        var leftv = {x: "Left", y: [l.min, l.q1, l.med, l.q3, l.max]}
        var rightv = {x: "Right", y: [r.min, r.q1, r.med, r.q3, r.max]}
        
        this.state = {
            series: [{
                type: "boxPlot",
                data: [leftv, rightv]
            }],
            options: {
                chart: {
                  type: 'boxPlot',
                  height: 350
                },
                title: {
                  text: this.props.title,
                  align: 'left'
                },
                plotOptions: {
                  boxPlot: {
                    colors: {
                      upper: '#5C4742',
                      lower: '#A5978B'
                    }
                  }
                }
            }
        };
    }

    render() {
        if (this.props.left === undefined) {
            return (
                <div className="graph-wrapper">
                <h2 className="title">Loading...</h2>
            </div>
            );
        }
        return (
            <Chart options={ this.state.options } 
                                series={ this.state.series } 
                                type="boxPlot" height={350} 
            />
        );
    }
}