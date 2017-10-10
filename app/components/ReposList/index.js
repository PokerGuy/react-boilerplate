import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
const _ = require('lodash');
const moment = require('moment-timezone');
//https://react-table.js.org/#/story/cell-renderers-custom-components
function ReposList(repos) {
  let content = (<div>Fetching Repos...</div>);
  if (repos.repos) {
    console.log(repos.repos);
    const columns = [{
      Header: 'Repo',
      accessor: 'repo_name',
      Cell: row => (
        <div
        style={{backgroundColor: '#85cc00'}}>
    {row.value}
    </div>
      )
    },
    {
      Header: 'Committer',
      accessor: 'committer.name'
    },
    {
      Header: 'Message',
      accessor: 'message'
    }];
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
