const React = require('react');

class Delete extends React.Component {

    render() {

        let url = '/pokemon/' + this.props.pokemon.id + '?_method=delete';

        return(

            <html>
            <head />
            <body>
                <h1>Delete {this.props.pokemon.name}?</h1>
                <form method="POST" action={url}>
                    <input type="hidden" name="id" value={this.props.pokemon.id}/>
                    <input type="submit" value="Delete"/>
                </form>
            </body>
            </html>

    )};
};

module.exports = Delete;