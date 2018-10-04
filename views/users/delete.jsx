const React = require('react');

class Delete extends React.Component {

    render() {

        let url = '/users/' + this.props.trainer.id + '?_method=delete';

        return(

            <html>
            <head />
            <body>
                <h1>Delete {this.props.trainer.username}?</h1>
                <form method="POST" action={url}>
                    <input type="hidden" name="id" value={this.props.trainer.id}/>
                    <input type="submit" value="Delete"/>
                </form>
            </body>
            </html>
    )};
};

module.exports = Delete;