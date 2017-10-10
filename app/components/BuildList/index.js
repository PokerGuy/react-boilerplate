import React, {PropTypes} from 'react';
import { Link } from 'react-router';
const Reactable = require('reactable');
const Table = Reactable.Table;
const Tr = Reactable.Tr;
const Td = Reactable.Td;
const _ = require('lodash');
const moment = require('moment-timezone');

function BuildList(builds) {
  console.log(builds);
  let content = (<div>Fetching Builds...</div>);
  if (builds.builds) {
    content = <Table className="table" id="table" itemsPerPage={4} pageButtonLimit={5} sortable={['Repo', 'Committer', 'Start Time']} filterable={['Repo', 'Committer', 'Start Time', 'Hash']}>
    {builds.builds.map(function(build, index) {
      let status="green";
      console.log(build.end_time);
      if (build.error || (build.start_time < ((new Date).getTime() - (5 * 60 * 1000)) && build.end_time === undefined)) {
        status = "red";
      } else if (build.end_time === undefined && build.start_time > ((new Date).getTime() - (5 * 60 * 1000))) {
        status = "yellow";
      }
      return <Tr key={index}>
        <Td column="Repo" className={status}>{build.repo_name}</Td>
        <Td column="Committer" className={status}>{build.committer.name}</Td>
        <Td column="Message" className={status}>{build.message}</Td>
        <Td column="Start Time" className={status}>{moment.tz(build.build_start, "America/Chicago").format('hh:mm:ss a MM/DD/YYYY')}</Td>
        <Td column="Hash" className={status}>{build.hash.substring(0,4)}</Td>
        <Td column="Build Details" className={status}>Placeholder</Td>
      </Tr>
    })}
    </Table>
  }
  return <div>
    {content}
  </div>;
}

BuildList.propTypes = {
  builds: PropTypes.any,
};

export default BuildList;
