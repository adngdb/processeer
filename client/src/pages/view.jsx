import React from 'react';
import { Button, ButtonGroup, Glyphicon, Panel } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { connect } from 'react-redux';

import { fetchView, runView, removeViewContent, updateViewInput } from '../actions/views.jsx';
import { fetchReport } from '../actions.jsx';
import View from '../components/view.jsx';
import ViewInput from '../components/view-input.jsx';
import Loader from '../components/loader.jsx';


const ViewPage = React.createClass({
    componentWillMount() {
        this.checkView(this.props);
    },

    componentWillReceiveProps(nextProps) {
        this.checkView(nextProps);
    },

    checkView(props) {
        let viewId = props.params.viewId;
        let view = props.views[viewId];

        if (!view) {
            props.dispatch(fetchView(viewId));
        }
        else if (view && view.reports.length) {
            if (!props.reports[view.reports[0]]) {
                props.dispatch(fetchReport(view.reports[0]));
            }
            else if (!view.isRunning && !view.isFetching && !view.content) {
                props.dispatch(runView(view));
            }
        }
    },

    runView() {
        let viewId = this.props.params.viewId;
        let view = this.props.views[viewId];

        this.props.dispatch(removeViewContent(viewId));
        this.props.dispatch(runView(view));
    },

    updateInput(key, value) {
        let viewId = this.props.params.viewId;
        let input = this.props.views[viewId].input || {};

        input[key] = value;
        this.props.dispatch(updateViewInput(viewId, input));
    },

    render() {
        let viewId = this.props.params.viewId;
        let view = this.props.views[viewId];

        let title = 'View';

        let content;
        let params = null;
        if (!view || view.isFetching) {
            content = <Loader />;
        }
        else {
            if (view.reports.length) {
                let firstReport = this.props.reports[view.reports[0]];
                if (firstReport && !firstReport.isFetching) {
                    params = <ViewInput report={firstReport} input={view.input} updateInput={this.updateInput} />;
                }
            }

            title = view.name || view.slug || title;
            content = <View view={view} />;
        }

        return (
            <Panel header={title}>
                <ButtonGroup>
                    <Button onClick={this.runView}><Glyphicon glyph="refresh" /> Run</Button>
                    <LinkContainer to={ {pathname: '/edit/view/'+viewId} }>
                        <Button><Glyphicon glyph="edit" /> Edit</Button>
                    </LinkContainer>
                </ButtonGroup>
                {params}
                {content}
            </Panel>
        );
    }
});

const mapStateToProps = (state) => {
    return {
        views: state.views,
        reports: state.reports,
    };
}

export default connect(mapStateToProps)(ViewPage);
