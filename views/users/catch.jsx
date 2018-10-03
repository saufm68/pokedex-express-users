const React = require('react');

class Catch extends React.Component {

    render() {
        console.log(this.props.pokemon);

        let toCatch = this.props.pokemon.map((element) => {

            return <div key={element.id}><input type="checkbox" name="pokemon_id" value={element.id} /> {element.name}</div>
        });

        let url = '/catch/' + this.props.trainer;

        return(

            <html>
            <head />
            <body>
                <h1>
                    Select the Pokemon to Catch
                </h1>
                <form method="POST" action={url}>
                    <input type="hidden" name="trainer_id" value={this.props.trainer}/>
                    {toCatch}
                    <input type="submit" value="Catch"/>
                </form>
            </body>
            </html>
    )};
};

module.exports = Catch;