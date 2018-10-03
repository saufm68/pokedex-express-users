var React = require("react");

class Home extends React.Component {
  render() {

    let pokemon = this.props.pokemon.map(pokemon => (

         <li key={pokemon.id}><a href={'/pokemon/' +  pokemon.id}> {pokemon.name}</a></li>
    ));

    let trainer = this.props.trainer.map(trainer => (

        <li key={trainer.id}><a href={'/users/' + trainer.id}> {trainer.name}</a></li>
    ));

    //console.log(this);
    return (
      <html>
        <head>
            <link rel="stylesheet" type="text/css" href="/style.css"/>
        </head>
        <body>
          <div className="pokemon">
          <h1>Pokedex</h1>
          <ul>
            {pokemon}
          </ul>
          <a href="/pokemon/new"><button>Add new Pokemon</button></a>
          </div>
          <div className="trainer">
            <h1>Trainerdex</h1>
            <ul>
                {trainer}
            </ul>
            <a href="/users/new"><button>Add new Trainer</button></a>
          </div>
        </body>
      </html>
    );
  }
}

module.exports = Home;
