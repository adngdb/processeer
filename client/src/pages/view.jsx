import React from 'react';
import { Button, Panel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { runView } from '../actions/views.jsx';
import View from '../components/view.jsx';
import Loader from '../components/loader.jsx';


const ViewPage = React.createClass({
    componentWillMount() {
        this.checkView(this.props);
    },

    checkView(props) {
        let viewId = props.params.viewId;
        let view = props.views[viewId];

        if (!view || (!view.isRunning && !view.isFetching && !view.content)) {
            props.dispatch(runView(viewId));
        }
    },

    render() {
        let viewId = this.props.params.viewId;
        let view = this.props.views[viewId];

        let content;
        if (!view || view.isFetching) {
            content = <Loader />;
        }
        else {
            content = <View view={view} />;
        }

        return (
            <Panel header="View">
                <LinkContainer to={ {pathname: '/edit/view/'+viewId} }>
                    <Button bsStyle="primary">Edit</Button>
                </LinkContainer>
                {content}
            </Panel>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        views: state.views,
    };
}

export default connect(mapStateToProps)(ViewPage);
