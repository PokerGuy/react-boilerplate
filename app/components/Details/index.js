import React, {PropTypes} from 'react';
const moment = require('moment-timezone');

function formatTime(time) {
  return moment.tz(time, 'America/Chicago').format('MM/DD/YYYY hh:mm:ss a');
}


function Details(details) {
  let content = (<div>Fetching Details...</div>);
  if (details.details) {
    const sorted = _.sortBy(details.details, 'build_step_time');
    content = sorted.map(function(detail, index) {
      return (<div key={index}>
        {formatTime(detail.build_step_time)} {detail.type}:
        {detail.output}
      </div>);
    });
  }
  return (<div>
    {content}
  </div>);
}


Details.propTypes = {
  details: PropTypes.any,
};

export default Details;
