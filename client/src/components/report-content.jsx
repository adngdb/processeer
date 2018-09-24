import React from 'react';

import ReactTable from 'react-table';
import { Line } from 'react-chartjs-2';

import 'react-table/react-table.css';


export default class ReportContent extends React.Component {
    render() {
        const content = this.props.content;
        let result;

        if (content.type === 'tables') {
            result = content.data.map((set, i) => {
                 return <div key={i}>
                    <h3>{ set.title }</h3>
                    <ReactTable
                        data={ set.data }
                        columns={ set.columns }
                        { ...set.options }
                    />
                </div>;
            });
        }
        else if (content.type === 'table') {
            result = <ReactTable
                data={ content.data }
                columns={ content.columns }
                { ...content.options }
            />;
        }
        else if (content.type === 'chart' || content.type === 'chart:line') {
            result = <Line data={content.data} options={content.data.options || {}} width={800} height={400} />;
        }
        else {
            result = JSON.stringify(content);
        }

        return <div>{ result }</div>;
    }
}
