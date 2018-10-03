var React = require("react");

class Pokemon extends React.Component {
  render() {

    let updateUrl = '/pokemon/' + this.props.pokemon.id + '/edit';
    let deleteUrl = '/pokemon/' + this.props.pokemon.id + '/delete';

    return (
      <html>
        <head />
        <body>
          <div>
            <ul className="pokemon-list">
              <li className="pokemon-attribute">
                id: {this.props.pokemon.id}
              </li>
              <li className="pokemon-attribute">
                name: {this.props.pokemon.name}
              </li>
              <li className="pokemon-attribute">
                img: {this.props.pokemon.img}
              </li>
              <li className="pokemon-attribute">
                height: {this.props.pokemon.height}
              </li>
              <li className="pokemon-attribute">
                weight: {this.props.pokemon.weight}
              </li>

            </ul>
            <a href={updateUrl}><button>Update</button></a>
            <br/>
            <a href={deleteUrl}><button>Delete</button></a>
          </div>
        </body>
      </html>
    );
  }
}

module.exports = Pokemon;
