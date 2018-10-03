const React = require('react');

class User extends React.Component {

    render() {

        let url = "/catch/" + this.props.trainer.id;

        return(

            <html>
            <head />
            <body>
                <h1>
                    {this.props.trainer.name}
                </h1>
                <a href={url}><button>Catch'em All</button></a>
            </body>
            </html>
    )};
};

module.exports = User;