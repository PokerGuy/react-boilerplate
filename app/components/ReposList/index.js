import React, {PropTypes} from 'react';
const moment = require('moment-timezone');

function ReposList(repos) {
  let content = (<div>Fetching Repos...</div>);
  if (repos.repos) {
    content = repos.repos.map(function (repo, index) {
      return <div key={index} className="yellow">
        &nbsp;<a href="#">{repo.repo_name}</a><br/>
        &nbsp;Committer: {repo.committer.name}<br/>
        &nbsp;Start Time: {moment.tz(repo.start_time, "America/Chicago").format('hh:mm:ss a MM/DD/YYYY')}<br/>
        &nbsp;Commit Message: {repo.message}<br/>
        &nbsp;Hash: {repo.hash.substring(0, 4)}
      </div>
    });
  }
  return <div>
    {content}
  </div>;
}

ReposList.propTypes = {
  repos: PropTypes.any,
};

export default ReposList;
