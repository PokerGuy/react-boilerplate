import React from 'react';
import Waiting from '../../images/waiting.gif';
const _ = require('lodash');
const moment = require('moment-timezone');

function formatTime(time) {
  return moment.tz(time, 'America/Chicago').format('MM/DD/YYYY hh:mm:ss a');
}


function Details(details) {
  let content = (<div className="centered"><img src={Waiting}/></div>);
  if (details.details) {
    const sorted = _.sortBy(details.details, 'build_step_time');
    content = sorted.map((detail, index) =>
      <div key={index}>
        {formatTime(detail.build_step_time)} {detail.type}:
        {detail.output}
      </div>
    );
  }
  return (<div>
    {content}
  </div>);
}

export default Details;
