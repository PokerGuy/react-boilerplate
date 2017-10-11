import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
const moment = require('moment-timezone');

function formatTime(time) {
  return moment.tz(time, "America/Chicago").format('MM/DD/YYYY hh:mm:ss a');
}

function cellColor(row) {
  if (row.original.error || (row.original.start_time < ((new Date).getTime() - (5 * 60 * 1000)) && row.original.end_time === undefined)) {
    return <div className="red">Error</div>;
  } else if (row.original.end_time === undefined && row.original.start_time > ((new Date).getTime() - (5 * 60 * 1000))) {
    return  <div className="yellow">Building</div>;
  }
  return <div className="green">Complete</div>;
}

function ReposList(repos) {
  let content = (<div>Fetching Repos...</div>);
  if (repos.repos) {
    console.log(repos.repos);
    const columns = [{
      Header: 'Repo',
      accessor: 'repo_name',
      filterable: true,
    },
      {
        Header: 'Status',
        filterable: true,
        Cell: row => (
          cellColor(row)
        )
      },
    {
      Header: 'Committer',
      accessor: 'committer.name',
      filterable: true
    },
      {
        Header: 'Start Time',
        accessor: 'start_time',
        filterable: true,
        Cell: row => (
          formatTime(row.value)
        )
      },
    {
      Header: 'Message',
      accessor: 'message'
    },
      {
        Header: 'Git Hash',
        accessor: 'hash',
        filterable: true,
        Cell: row => (
          row.value.substring(0,6)
        )
      },
      {
        Header: 'Builds',
        accessor: 'repo_name',
        Cell: row => (
          <Link to={'/build/' + row.value}>Details</Link>
        )
      }
      ];
    content = <ReactTable data={repos.repos} columns={columns}/>
  }
  return <div>
    {content}
  </div>;
}

ReposList.propTypes = {
  repos: PropTypes.any,
};

export default ReposList;
