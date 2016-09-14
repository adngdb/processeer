import React from 'react';

import Griddle from 'griddle-react';
import { Line } from 'react-chartjs';


const ViewContent = React.createClass({
    render() {
        let content = this.props.content;
        let result;

        if (content.type === 'tables') {
            result = content.data.map((set, i) => {
                return (
                    <div key={i}>
                        <h3>{ set.title }</h3>
                        <Griddle results={set.data} />
                    </div>
                );
            });
        }
        else if (content.type === 'table') {
            result = <Griddle results={content.data} {...content.options} />;
        }
        else if (content.type === 'chart' || content.type === 'chart:line') {
            result = <Line data={content.data} width='800' height='400' />;
        }
        else {
            result = JSON.stringify(content);
        }

        return <div>{result}</div>;
    }
});

export default ViewContent;
