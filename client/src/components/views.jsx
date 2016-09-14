import React from 'react';
import { Button, Table } from 'react-bootstrap';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';


/*
 * Props:
 *   views
 *   deleteView
 *   fetchViews
 */
const Views = React.createClass({
    componentWillMount() {
        this.props.fetchViews();
    },

    render() {
        let views = Object.keys(this.props.views).map((id, i) => {
            let view = this.props.views[id];
            let title = view.name || view.slug || id;
            return (<tr key={i}>
                <td>
                    <Link to={ {pathname: '/view/' + id} }>{title}</Link>
                </td>
                <td>
                    <LinkContainer to={ {pathname: '/edit/view/' + id} }>
                        <Button>Edit</Button>
                    </LinkContainer>
                </td>
                <td><Button onClick={() => this.props.deleteView(id)}>Remove</Button></td>
            </tr>);
        });

        return (
            <Table>
                <thead>
                    <tr>
                        <td>Name</td>
                        <td></td>
                        <td></td>
                    </tr>
                </thead>
                <tbody>
                    {views}
                </tbody>
            </Table>
        );
    }
});

export default Views;
