import React, { Component } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
import Title from './Title';
import Heatmap from "./graphs/HeatMap";

class LastSixMonths extends Component {

  constructor(props) {
    super(props);

    // Pulling from Header.js

    this.state = {
      values: this.props.values
    }
  }

  preventDefault = (e) => {
    e.preventDefault();
  }

  render() {
    return (
      <React.Fragment>
        <Title>Last Six Month Overview</Title>
        <Table size="small">
          {/* <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Ship To</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell align="right">Sale Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.shipTo}</TableCell>
                <TableCell>{row.paymentMethod}</TableCell>
                <TableCell align="right">{`$${row.amount}`}</TableCell>
              </TableRow>
            ))}
          </TableBody> */}
          <Heatmap values={ this.state.values }/>
        </Table>
        <Link color="primary" href="#" onClick={this.preventDefault} sx={{ mt: 3 }}>
          See all sessions
        </Link>
      </React.Fragment>
    );
  }
}

export default LastSixMonths;