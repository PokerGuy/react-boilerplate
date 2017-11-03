import React from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import BuildList from '../../components/BuildList';
import { setRepo } from './actions';
import { makeSelectBuilds } from './selectors';
import { setPage } from '../App/actions';

export class BuildPage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  componentDidMount() {
    this.props.setRepo(this.props.params.repo);
    this.props.setPage('build');
  }

  render() {
    return (
      <article>
        <Helmet
          title="Builds"
          meta={[
            { name: 'description', content: 'Build Status' },
          ]}
        />
        <div>
          <br />
          <Link to="/">Repos</Link> / {this.props.params.repo}
          <BuildList builds={this.props.builds} />
        </div>
      </article>
    );
  }
}

BuildPage.propTypes = {
  setPage: React.PropTypes.func,
  setRepo: React.PropTypes.func,
  builds: React.PropTypes.array,
};

export function mapDispatchToProps(dispatch) {
  return {
    setRepo: (repo) => dispatch(setRepo(repo)),
    setPage: (page) => dispatch(setPage(page)),
  };
}

const mapStateToProps = createStructuredSelector({
  builds: makeSelectBuilds(),
});

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(BuildPage);
