import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Waiting from '../../images/waiting.gif';
const moment = require('moment-timezone');

function formatTime(time) {
  return moment.tz(time, 'America/Chicago').format('MM/DD/YYYY hh:mm:ss a');
}

function calcTime(row) {
  const minutes = Math.floor(((row.original.end_time - row.original.build_start) / 1000) / 60);
  let seconds = Math.floor(((row.original.end_time - row.original.build_start) / 1000) - (minutes * 60));
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  return `${minutes}:${seconds}`;
}

function cellColor(row) {
  if (row.original.error || (row.original.build_start < ((new Date()).getTime() - (5 * 60 * 1000)) && row.original.end_time === undefined)) {
    return <div className="red">Error</div>;
  } else if (row.original.end_time === undefined && row.original.build_start > ((new Date()).getTime() - (5 * 60 * 1000))) {
    return <div className="yellow">Building</div>;
  }
  return <div className="green">Complete</div>;
}

function BuildList(builds) {
  let content = (<div className="centered"><img src={Waiting} /></div>);
  if (builds.builds) {
    if (builds.builds.length > 0) {
      const columns = [
        {
          Header: 'Status',
          filterable: true,
          Cell: (row) => (
            cellColor(row)
          ),
        },
        {
          Header: 'Committer',
          accessor: 'committer.name',
          filterable: true,
        },
        {
          Header: 'Start Time',
          accessor: 'build_start',
          filterable: true,
          Cell: (row) => (
            formatTime(row.value)
          ),
        },
        {
          Header: 'Build Time',
          Cell: (row) => (
            calcTime(row)
          ),
        },
        {
          Header: 'Message',
          accessor: 'message',
        },
        {
          Header: 'Git Hash',
          accessor: 'hash',
          filterable: true,
          Cell: (row) => (
            row.value.substring(0, 6)
          ),
        },
        {
          Header: 'Output',
          accessor: 'repo_name',
          Cell: (row) => (
            <Link to={`/build/${row.original.repo_name}/${row.original.build_start}`}>Details</Link>
          ),
        },
      ];
      content = <ReactTable data={builds.builds} columns={columns}/>;
    }
  }
  return (
    <div>
      {content}
    </div>);
}


BuildList.propTypes = {
  builds: PropTypes.any,
};

export default BuildList;
