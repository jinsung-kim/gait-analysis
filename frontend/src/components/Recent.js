import React, { Component } from 'react';
// import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

import axios from "axios";

export default class Recent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    const url = "http://localhost:5000/streaksessions";
    const params = {
      "id": "618877e7ff9832fe99b10cd0"
    }
    axios.post(url, params)
      .then(res => {
        const data = res.data;

        this.setState({
          count: data["count"]
        });
      })
      // If there are issues with CORS
      .catch(error => console.log(error));
  }

  render() {
    return (
      <React.Fragment>
        <Title>Sessions in a row</Title>
          <Typography component="p" variant="h4">
            { this.state.count } day(s)
          </Typography>
          {/* <Typography color="text.secondary" sx={{ flex: 1 }}>
            on 15 March, 2019
          </Typography> */}
        <div>
          {/* <Link color="primary" href="#" onClick={this.preventDefault}>
            View balance
          </Link> */}
        </div>
      </React.Fragment>
    );
  }
}