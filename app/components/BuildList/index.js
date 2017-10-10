import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
const _ = require('lodash');
const moment = require('moment-timezone');

function BuildList(builds) {
  let content = (<div>Fetching Builds...</div>);
  if (builds.builds) {
    content = <ReactTable data={builds.builds} />
  }
  return <div>
    {content}
  </div>;
}

BuildList.propTypes = {
  builds: PropTypes.any,
};

export default BuildList;
