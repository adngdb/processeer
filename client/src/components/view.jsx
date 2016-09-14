import React from 'react';
import { Panel } from 'react-bootstrap';

import Loader from './loader.jsx';
import ViewContent from './view-content.jsx';


const View = React.createClass({
    render() {
        let view = this.props.view;
        let title = view.title || view.name || view.slug || view.id;

        let content;
        if (view.isRunning) {
            content = <Loader />;
        }
        else {
            content = <ViewContent content={view.content} />;
        }

        return (
            <div>
                <h2>{ title }</h2>
                { content }
            </div>
        );
    }
});

export default View;
