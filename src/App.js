import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as actions from './store/actions/remote';

import './App.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.props.history.listen((location, action) => {
            if (location.preventFetch === true) {
                return false;
            } else {
                return this.props.fetchPage(location.pathname);
            }
        });
    }

    render() {
        //@todo handle your 404s, loading etc, you may want to split into multiple components
        return (
            <div>
                {this.props.cms.post_content}
            </div>
        );
    }
}

const mapStateToProps = state => {
    if (!state.remote.cms.loading) {
        return { cms: state.remote.cms.result };
    } else {
        return { loading: true };
    }
};

const mapDispatchToProps = dispatch => {
    return {
        fetchPage: route => dispatch(actions.fetchData(route, 'cms'))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(App));
