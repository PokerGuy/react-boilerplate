/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Details from '../../components/Details';
import { setDetails } from './actions';
import { makeSelectDetails, makeSelectRepo } from './selectors';
const moment = require('moment-timezone');

export class BuildDetailsPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    this.props.setDetails(this.props.params.repo, this.props.params.start);
  }

  render() {
    const buildTime = moment.tz(parseInt(this.props.querystringParams.start), 'America/Chicago').format('MM/DD/YYYY hh:mm:ss a');
    return (
      <article>
        <Helmet
          title="Home Page"
          meta={[
            { name: 'description', content: 'A React.js Boilerplate application homepage' },
          ]}
        />
        <div>
          <br />
          <Link to="/">Repos</Link> / <Link to={"/build/" + this.props.querystringParams.repo}>{this.props.querystringParams.repo}</Link>
          / {buildTime}
          <div>
            <br />
            <Details details={this.props.details} />
          </div>
        </div>
      </article>
    );
  }
}

BuildDetailsPage.propTypes = {
  setDetails: React.PropTypes.func,
  details: React.PropTypes.array,
};

export function mapDispatchToProps(dispatch) {
  return {
    setDetails: (repo, start) => dispatch(setDetails(repo, start)),
  };
}

const mapStateToProps = createStructuredSelector({
  details: makeSelectDetails(),
  querystringParams: makeSelectRepo(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(BuildDetailsPage);
