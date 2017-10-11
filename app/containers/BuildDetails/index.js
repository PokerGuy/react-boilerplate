/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {createStructuredSelector} from 'reselect';
import BuildList from '../../components/BuildList';
import { setRepo } from './actions';
import { makeSelectBuilds } from './selectors';
const moment = require('moment-timezone');

export class BuildDetailsPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  /**
   * when initial state username is not null, submit the form to load repos
   */
  componentDidMount() {
    //this.props.setRepo(this.props.params.repo);
  }

  render() {
    const buildTime = moment.tz(parseInt(this.props.params.start), "America/Chicago").format('MM/DD/YYYY hh:mm:ss a');
    return (
      <article>
        <Helmet
          title="Home Page"
          meta={[
            {name: 'description', content: 'A React.js Boilerplate application homepage'},
          ]}
        />
        <div>
          <br/>
          <Link to="/">Repos</Link> / <Link to={"/build/" + this.props.params.repo}>{this.props.params.repo}</Link> / {buildTime}
          <BuildList builds={this.props.builds} />
        </div>
      </article>
    );
  }
}

BuildDetailsPage.propTypes = {
  loadRepos: React.PropTypes.func,
};

export function mapDispatchToProps(dispatch) {
  return {
    setRepo: (repo) => dispatch(setRepo(repo)),
  };
}

const mapStateToProps = createStructuredSelector({
  builds: makeSelectBuilds(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(BuildDetailsPage);
