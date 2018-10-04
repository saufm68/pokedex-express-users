const React = require('react');

class Home extends React.Component {


    render() {

        let pokemon = this.props.pokemon.map(pokemon => (

             <li key={pokemon.id}><a href={'/pokemon/' +  pokemon.id}> {pokemon.name}</a></li>
        ));

        return(

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
              </div>
              <div className="trainer">
                <h1>Trainerdex</h1>
                <a href="/login"><button>Login</button></a>
                <a href="/register"><button>Register</button></a>
              </div>
            </body>
          </html>
    )};
};

module.exports = Home;