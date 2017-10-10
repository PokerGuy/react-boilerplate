import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
const _ = require('lodash');
const moment = require('moment-timezone');
//https://react-table.js.org/#/story/cell-renderers-custom-components
function formatTime(time) {
  return moment.tz(time, "America/Chicago").format('MM/DD/YYYY hh:mm:ss a');
}


function cellColor(row) {
  if (row.original.error || (row.original.start_time < ((new Date).getTime() - (5 * 60 * 1000)) && row.original.end_time === undefined)) {
    return "red";
  } else if (row.original.end_time === undefined && row.original.start_time > ((new Date).getTime() - (5 * 60 * 1000))) {
    return  "yellow";
  }
  return "green";
}

function ReposList(repos) {
  let content = (<div>Fetching Repos...</div>);
  if (repos.repos) {
    console.log(repos.repos);
    const columns = [{
      Header: 'Repo',
      accessor: 'repo_name',
      Cell: row => (
        <span>
          <span style={{
            color: cellColor(row),
            transition: 'all .3s ease'
    }}> &#x25cf;
        </span>{row.value}</span>
      )
    },
    {
      Header: 'Committer',
      accessor: 'committer.name'
    },
      {
        Header: 'Start Time',
        accessor: 'start_time',
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

/*
if (repo.error || (repo.start_time < ((new Date).getTime() - (5 * 60 * 1000)) && repo.end_time === undefined)) {
        status = "red";
      } else if (repo.end_time === undefined && repo.start_time > ((new Date).getTime() - (5 * 60 * 1000))) {
        status = "yellow";
      }
 */
