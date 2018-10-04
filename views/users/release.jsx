const React = require('react');

class Release extends React.Component {

    render() {

        let release = this.props.pokemon.map((element) => {

            return <div key={element.id}><input type="checkbox" name="id" value={element.id} /> {element.name} </div>

        });

        return(

            <html>
                <head />
                <body>
                    <form method="POST" action="/release?_method=delete">
                        {release}
                        <input type="submit" value="release" />
                    </form>
                </body>
            </html>
    )};
};

module.exports = Release