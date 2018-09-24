import React from 'react';
import {
    Button,
    FormControl,
    Glyphicon,
    Table
} from 'react-bootstrap';


class ParamForm extends React.Component {
    updateParamName = (e) => {
        const { param, index, updateParam } = this.props;
        updateParam(index, { ...param, name: e.target.value });
    }

    updateParamDefault = (e) => {
        const { param, index, updateParam } = this.props;
        updateParam(index, { ...param, defaultValue: e.target.value });
    }

    updateParamRequired = (e) => {
        const { param, index, updateParam } = this.props;
        updateParam(index, { ...param, required: e.target.value });
    }

    removeParam = () => {
        const { index, removeParam } = this.props;
        removeParam(index);
    }

    render() {
        const { param, index } = this.props;

        return <tr key={ index }>
           <td>
               <FormControl
                 type="text"
                 value={ param.name }
                 data-index={ index }
                 onChange={ this.updateParamName }
               />
           </td>
           <td>
               <FormControl
                 type="text"
                 value={ param.defaultValue }
                 data-index={ index }
                 onChange={ this.updateParamDefault }
               />
           </td>
           <td>
               <FormControl
                 type="text"
                 value={ param.required }
                 data-index={ index }
                 onChange={ this.updateParamRequired }
               />
           </td>
           <td>
               <Button onClick={ this.removeParam }>
                   <Glyphicon glyph="remove" />
               </Button>
           </td>
       </tr>;
    }
}


export default class BlockParamsForm extends React.Component {
    addParam = () => {
        const { block, updateBlock } = this.props;
        const params = block.params.concat({});
        updateBlock(block.id, { params });
    }

    updateParam = (index, param) => {
        const { block, updateBlockParam } = this.props;
        updateBlockParam(block.id, index, param);
    }

    removeParam = (index) => {
        const { block, updateBlock } = this.props;
        const params = block.params.filter((elem, i) => i !== index);
        updateBlock(block.id, { params });
    }

    render() {
        const { block } = this.props;
        const params = block.params || [];

        return <React.Fragment>
            <Button
                bsStyle="primary"
                onClick={ this.addParam }
                className="pull-right"
            >
                <Glyphicon glyph="plus" /> Add Param
            </Button>
            <h3>Params</h3>
            <Table striped hover>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td>Default</td>
                        <td>Required?</td>
                        <td />
                    </tr>
                </thead>
                <tbody>
                    { params.map((param, i) => {
                        return <ParamForm
                            param={ param }
                            index={ i }
                            updateParam={ this.updateParam }
                            removeParam={ this.removeParam }
                            key={ i }
                        />;
                    }) }
                </tbody>
            </Table>
        </React.Fragment>;
    }
}
