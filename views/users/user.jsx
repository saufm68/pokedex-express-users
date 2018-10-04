const React = require('react');

class User extends React.Component {

    render() {

        let catchUrl = "/catch/" + this.props.trainer.id;
        let deleteUrl = "/users/" + this.props.trainer.id + '/delete';

        let actionButton;
        let release;

        if (parseInt(this.props.currentUser) === this.props.trainer.id) {

            actionButton = <div><a href={deleteUrl}><button>Delete Trainer</button></a>
                <a href={catchUrl}><button>Catch'em All</button></a></div>

            if(this.props.pokemon.length !== 0) {

                release = <a href="/users/release"><button>Release</button></a>
            }


        }

        let options;

        if (this.props.pokemon.length !== 0) {

            options = this.props.pokemon.map((element) => {

                return <option key={element.id} value={element.id}>{element.name}</option>
            });
        }


        return(

            <html>
            <head />
            <body>
                <h1>
                    {this.props.trainer.username}
                </h1>
                {actionButton}
                <form method="GET" action="/pokemon/">
                    <select name="id">
                        {options}
                    </select>
                    <input type="submit" value="See Pokemon" />
                </form>
                {release}
                <a href="/"><button>Home</button></a>
            </body>
            </html>
    )};
};

module.exports = User;