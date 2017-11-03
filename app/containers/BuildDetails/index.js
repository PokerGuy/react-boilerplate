import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import Details from '../../components/Details';
import { setDetails } from './actions';
import { makeSelectDetails, makeSelectDetailParams } from './selectors';
import { setPage } from '../App/actions';
const moment = require('moment-timezone');

export class BuildDetailsPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.setDetails(this.props.params.repo, this.props.params.start);
    this.props.setPage('build_details');
  }

  render() {
    const buildTime = moment.tz(parseInt(this.props.repo.start), 'America/Chicago').format('MMMM DD YYYY hh:mm:ss a');
    return (
      <article>
        <Helmet
          title="Build Details"
          meta={[
            { name: 'description', content: 'Build Details' },
          ]}
        />
        <div>
          <br />
          <Link to="/">Repos</Link> / <Link to={`/build/${this.props.repo.repo}`}>{this.props.repo.repo}</Link>
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
  repo: React.PropTypes.object,
  setPage: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    setDetails: (repo, start) => dispatch(setDetails(repo, start)),
    setPage: (page) => dispatch(setPage(page)),
  };
}

const mapStateToProps = createStructuredSelector({
  details: makeSelectDetails(),
  repo: makeSelectDetailParams(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(BuildDetailsPage);
