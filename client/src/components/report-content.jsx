import React from 'react';

import Griddle from 'griddle-react';
import { Line } from 'react-chartjs-2';


const ReportContent = React.createClass({
    render() {
        const content = this.props.content;
        let result;

        if (content.type === 'tables') {
            result = content.data.map((set, i) =>
                 (
                    <div key={i}>
                        <h3>{ set.title }</h3>
                        <Griddle results={set.data} {...set.options} />
                    </div>
                )
            );
        }
        else if (content.type === 'table') {
            result = <Griddle results={content.data} {...content.options} />;
        }
        else if (content.type === 'chart' || content.type === 'chart:line') {
            result = <Line data={content.data} options={content.data.options || {}} width={800} height={400} />;
        }
        else {
            result = JSON.stringify(content);
        }

        return <div>{result}</div>;
    },
});

export default ReportContent;
