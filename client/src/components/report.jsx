import React from 'react';

import Loader from './loader.jsx';
import ReportContent from './report-content.jsx';


const Report = React.createClass({
    render() {
        const report = this.props.report;
        const title = report.title || report.name || report.slug || report.id;

        let content;
        if (report.isRunning) {
            content = <Loader />;
        }
        else {
            content = <ReportContent content={report.content} />;
        }

        return (
            <div>
                <h2>{ title }</h2>
                { content }
            </div>
        );
    },
});

export default Report;
