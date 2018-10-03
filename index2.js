const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');



// Initialise postgres client
const config = {
  user: 'saufi',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
};

const pool = new pg.Pool(config);

pool.on('error', function (err) {
  console.log('Idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//To allow to link to style.css
app.use(express.static('public'));

// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);



/* JOIN =====================================
===========================================*/

app.get('/catch/:id', (request, response) => {

    let text = "SELECT * FROM pokemon";

    pool.query(text, (err, result) => {

        if (err) {

            console.log("query error1: ", err.message);
            response.send("ERROR31");

        } else {

            trainerId = request.params.id;

            response.render('users/catch', {pokemon: result.rows, trainer: trainerId });
        }

    });

});

app.post('/catch/:id', (request, response) => {

    let text = "INSERT INTO catching (pokemon_id, trainer_id) VALUES ($1, $2)";

    for (let i = 0; i < request.body.pokemon_id.length; i++) {

        var values = [request.body.pokemon_id[i], request.params.id];

        pool.query(text, values, (err, result) => {

            if (err) {

                console.log("query error1: ", err.message);
                response.send("ERROR32");

            } else {

                if(i = (request.body.pokemon_id.length - 1) ) {

                    response.redirect('/users/' + request.params.id);

                }

            }

        });
    }

});



/* USER ============================
==================================*/

app.get('/users/new', (request, response) => {

    response.render('users/new');

});

app.post('/users', (request, response) => {

    let text = "INSERT INTO trainer (name) Values ($1) RETURNING id, name;";

    let values = [request.body.name];

    pool.query(text, values, (err, result) => {

        if (err) {

            console.log("query error1: ", err.message);
            response.send("ERROR3");

        } else {

            console.log(result.rows);
            response.redirect('/');
        }

    });
});

app.get('/users/:id', (request, response) => {

    let text = "SELECT * FROM trainer WHERE id=" + request.params.id;

    pool.query(text, (err, result) => {

        if (err) {

            console.log("query error: ", err.message);
            response.send("ERROR!!!")

        } else {

            response.render('users/user', {trainer: result.rows[0]});
        }


    });

});


/*POKEMON======================================
=============================================*/

app.get('/pokemon/new', (request, response) => {

    response.render('pokemon/new');
});

app.post('/pokemon', (request, response) => {

    let text = "INSERT INTO pokemon (name, img, height, weight) VALUES ($1, $2, $3, $4) RETURNING id, name;";

    let values = [request.body.name, request.body.img, request.body.height, request.body.weight];

    pool.query(text, values, (err, result) => {

        if (err) {

            console.log("query error: ", err.message);
            response.send("ERROR!!!")

        } else {

            response.redirect('/');
        }
    })

});


app.get('/pokemon/:id', (request, response) => {

    let text = "SELECT * FROM pokemon WHERE id=" + request.params.id;

    pool.query(text, (err, result) => {

        if (err) {

            console.log("query error: ", err.message);
            response.send("ERROR");
        } else {

            response.render('pokemon/pokemon', {pokemon: result.rows[0]});

        }

    });

});


app.get('/pokemon/:id/edit', (request, response) => {

    let text =  "SELECT * FROM pokemon WHERE id =" + request.params.id;

    pool.query(text, (err, result) => {

        if (err) {

            console.log("query error: ", err.message);
            response.send("ERROR");

        } else {

            response.render('pokemon/edit', {pokemon: result.rows[0]});
        }

    });

});

app.put('/pokemon/:id', (request, response) => {

    let text = "UPDATE pokemon SET name=($1), img=($2), height=($3), weight=($4) WHERE id=" + request.params.id;

    let values = [request.body.name, request.body.img, request.body.height, request.body.weight];

    pool.query(text, values, (err, result) => {

        if(err) {

            console.log("query error: ", err.message);
            response.send("ERROR");
        } else {

            response.redirect('/pokemon/' + request.params.id);
        }

    });

});

app.get('/pokemon/:id/delete', (request, response) => {

    let text = "SELECT * FROM pokemon WHERE id=" + request.params.id;

    pool.query(text, (err, result) => {

        if(err) {

            console.log("query error: ", err.message);
            response.send("ERROR!!!");

        } else {

            response.render('pokemon/delete', {pokemon: result.rows[0]});

        }

    });

});

app.delete('/pokemon/:id', (request, response) => {

    let text =  "DELETE from pokemon WHERE id=" + request.params.id;

    pool.query(text, (err, result) => {

        if (err) {

            console.log("query error: ", err.message);
            response.send("ERROR!!!");
        } else {

            response.redirect('/');
        }

    });

});








/*ROOT=====================================
=========================================*/

app.get('/', (request, response) => {

    let text = "SELECT * FROM pokemon;"
    let text2 = "SELECT * FROM trainer"
    var pokemon = {};

    pool.query(text, (err, result) => {

        if (err) {

            console.log("error message1: ",err);
            response.send("ERROR");

        } else {

            pokemon["pokedex"] = result.rows;
            pool.query(text2, (err, result) => {

                if (err) {
                    console.log("error message2: ", err);
                    response.send("ERROR2");

                } else {

                    pokemon['trainerdex'] = result.rows;
                    response.render('pokemon/home', {pokemon: pokemon["pokedex"], trainer: pokemon['trainerdex']});
                }

            });

        }
    })

});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);