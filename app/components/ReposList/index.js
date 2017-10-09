import React, {PropTypes} from 'react';
const Reactable = require('reactable');
const Table = Reactable.Table;
const Tr = Reactable.Tr;
const Td = Reactable.Td;
const _ = require('lodash');
const moment = require('moment-timezone');

function ReposList(repos) {
  let content = (<div>Fetching Repos...</div>);
  if (repos.repos) {
    content = <Table className="table" id="table" itemsPerPage={4} pageButtonLimit={5} sortable={['Repo', 'Committer', 'Start Time']} filterable={['Repo', 'Committer', 'Start Time', 'Hash']}>
    {repos.repos.map(function(repo, index) {
      let status="green";
      console.log(repo.end_time);
      if (repo.error || (repo.start_time < ((new Date).getTime() - (5 * 60 * 1000)) && repo.end_time === undefined)) {
        status = "red";
      } else if (repo.end_time === undefined && repo.start_time > ((new Date).getTime() - (5 * 60 * 1000))) {
        status = "yellow";
      }
      return <Tr key={index}>
        <Td column="Repo" className={status}>{repo.repo_name}</Td>
        <Td column="Committer" className={status}>{repo.committer.name}</Td>
        <Td column="Start Time" className={status}>{moment.tz(repo.start_time, "America/Chicago").format('hh:mm:ss a MM/DD/YYYY')}</Td>
        <Td column="Hash" className={status}>{repo.hash.substring(0,4)}</Td>
      </Tr>
    })}
    </Table>
  }
  return <div>
    {content}
  </div>;
}

ReposList.propTypes = {
  repos: PropTypes.any,
};

export default ReposList;
