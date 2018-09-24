import React from 'react';
import {
    Button,
    Glyphicon,
    Table
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';


class ModelForm extends React.Component {
    removeModel = () => {
        const { index, removeModel } = this.props;
        removeModel(index);
    }

    render() {
        const { block, model, index } = this.props;
        const endpoint = model.endpoint || '';
        const params = model.params || {};

        return <tr key={ index }>
            <td>
                <Link to={{ pathname: `/edit/block/${ block.id }/model/${ index }` }}>
                    { `#${index}` }
                </Link>
            </td>
            <td>{ endpoint }</td>
            <td>{ Object.keys(params).length }</td>
            <td>
                <LinkContainer to={ { pathname: `/edit/block/${ block.id }/model/${ index }` } }>
                    <Button>Edit</Button>
                </LinkContainer>
            </td>
            <td>
                <Button onClick={ this.removeModel }>
                    <Glyphicon glyph="remove" /> Remove
                </Button>
            </td>
        </tr>;
    }
}


export default class BlockModelsForm extends React.Component {
    addModel = () => {
        const { block, updateBlock } = this.props;
        const models = block.models.concat({});
        updateBlock(block.id, { models });
    }

    removeModel = (index) => {
        const { block, updateBlock } = this.props;
        const models = block.models.filter((elem, i) => i !== index);
        updateBlock(block.id, { models });
    }

    render() {
        const { block } = this.props;
        const models = block.models || [];

        return <React.Fragment>
            <Button
                bsStyle="primary"
                onClick={ this.addModel }
                className="pull-right"
            >
                <Glyphicon glyph="plus" /> Add Model
            </Button>
            <h3>Models</h3>
            <Table striped hover>
                <thead>
                    <tr>
                        <td>Index</td>
                        <td>Endpoint</td>
                        <td># of params</td>
                        <td />
                        <td />
                    </tr>
                </thead>
                <tbody>
                    { models.map((model, index) => {
                        return <ModelForm
                            model={ model }
                            block={ block }
                            index={ index }
                            removeModel={ this.removeModel }
                            key={ index }
                        />;
                    }) }
                </tbody>
            </Table>
        </React.Fragment>;
    }
}
