import React from 'react';

import Loader from './loader.jsx';
import ViewContent from './view-content.jsx';


const View = React.createClass({
    render() {
        const view = this.props.view;
        const title = view.title || view.name || view.slug || view.id;

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
    },
});

export default View;
