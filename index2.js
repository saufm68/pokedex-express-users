const express = require('express');
const methodOverride = require('method-override');
const pg = require('pg');
const cookieParser = require('cookie-parser');
var sha256 = require('js-sha256');


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
app.use(cookieParser());

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

    let text = "INSERT INTO catching (pokemon_id, trainer_id) VALUES ";
    let params = request.params.id;
    let values = [];

    for (let i = 1; i <= request.body.pokemon_id.length; i++) {

        if (i === request.body.pokemon_id.length) {
            text += `($${i}, '${params}');`;
        } else {
            text += `($${i}, '${params}'), `;
        }

        values.push(request.body.pokemon_id[i - 1]);

    }

    pool.query(text, values, (err, result) => {

        if (err) {

            console.log("query error: ", err.message);
            response.send("ERROR");
        } else {

            response.redirect('/users/' + params);
        }

    });

});



/* USER ============================
==================================*/
app.get('/users/release', (request, response) => {

    let text = "SELECT pokemon.id, pokemon.name FROM pokemon INNER JOIN catching ON (catching.pokemon_id= pokemon.id) WHERE catching.trainer_id='" + request.cookies['userId'] + "';";

    pool.query(text, (err, result) => {

        if (err) {

            console.log("release query error: ", err.message);
            response.send("ERROR");
        } else {

            response.render('users/release', {pokemon: result.rows});
        }
    });

});

app.delete('/release', (request, response) => {

    if (Array.isArray(request.body.id)) {

        let text = "DELETE FROM catching WHERE (pokemon_id=" + request.body.id[0];

        for(let i = 1; i < request.body.id.length; i++) {

            text += " OR pokemon_id=" + request.body.id[i];

        }

        text += ") AND trainer_id=" + request.cookies['userId'];

        pool.query(text, (err, result) => {

            if (err) {

                console.log("array delete query error: ", err.message);
                response.send("ERROR");

            } else {

             response.redirect('/users/' + request.cookies['userId']);

            }

        })


    } else {

        let text = "DELETE FROM catching WHERE pokemon_id=" + request.body.id + " AND trainer_id=" + request.cookies['userId'];

        pool.query(text, (err, result) => {

            if (err) {

                console.log("single delete query error: ", err.message);
                response.send("ERROR");

            } else {

                response.redirect('/users/' + request.cookies['userId']);
            }
        })

    }

});

app.get('/users/new', (request, response) => {

    response.render('users/new');

});

app.post('/users', (request, response) => {

    let text = "INSERT INTO trainer (username) Values ($1) RETURNING id, username;";

    let values = [request.body.username];

    pool.query(text, values, (err, result) => {

        if (err) {

            console.log("query error1: ", err.message);
            response.send("ERROR3");

        } else {

            //console.log(result.rows);
            response.redirect('/');
        }

    });
});

app.get('/users/:id', (request, response) => {

    let text = "SELECT pokemon.id,pokemon.name FROM pokemon INNER JOIN catching ON (catching.pokemon_id = pokemon.id) WHERE catching.trainer_id="  + request.params.id;
    let text2 = "SELECT * FROM trainer WHERE id=" + request.params.id;
    let id = request.params.id;
    let loggedInUser = request.cookies['userId'];
    let caughtPokemon;

    pool.query(text, (err, result) => {

        if (err) {

            console.log("query error: ", err.message);
            response.send("ERROR!!!")

        } else {

            caughtPokemon = result.rows;

            pool.query(text2, (err, result) => {

                if(err) {

                    console.log("inner query error: ", err.message);
                    response.send("ERROR!!!")

                } else {

                    response.render('users/user', {pokemon: caughtPokemon, trainer: result.rows[0], currentUser: loggedInUser});
                }

            });
        }


    });

});




app.get('/users/:id/delete', (request, response) => {

    let text = 'SELECT * FROM trainer WHERE id=' + request.params.id;

    pool.query(text, (err, result) => {

        if (err) {

            console.log("query error1: ", err.message);
            response.send("ERROR3");

        } else {

            response.render('users/delete', {trainer: result.rows[0]});
        }
    });

});

app.delete('/users/:id', (request, response) => {

    let text = "DELETE FROM trainer WHERE id=" + request.params.id;
    let text2 = "DELETE FROM catching WHERE trainer_id=" + request.params.id;

    pool.query(text, (err, result) => {

        if (err) {

            console.log("query error1: ", err.message);
            response.send("ERROR3");

        } else {

            pool.query(text2, (err, result) => {

                if (err) {

                    console.log("query error2: ", err.message);
                    response.send("ERROR4");

                } else {

                    response.redirect('/');

                }

            });
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
    let text2 = "DELETE from catching WHERE pokemon_id="+ request.params.id;

    pool.query(text, (err, result) => {

        if (err) {

            console.log("query error: ", err.message);
            response.send("ERROR!!!");
        } else {

            pool.query(text2, (err, result) => {

                if (err) {

                    console.log("query error: ", err.message);
                    response.send("ERROR!!!");
                } else {

                    response.redirect('/');

                }

            });
        }

    });

});



/*ROOT=====================================
=========================================*/

app.get('/login', (request, response) => {

    response.render('users/login');

});

app.post('/login', (request, response)=> {

    let text = "SELECT * FROM trainer WHERE username='" + request.body.username + "';";

    pool.query(text, (err, result) => {

        if(err) {

            console.log("login query error: ", err.message);
            response.send("ERROR");
        } else {

            if(result.rows[0] !== undefined && sha256(request.body.password) === result.rows[0].password) {

                console.log("logged-in as: ", request.body.username);
                response.cookie('loggedIn', request.body.username);
                response.cookie('userId', result.rows[0].id);
                response.redirect('/');

            } else {

                console.log('wrong username/password');
                response.redirect('/login');
            }
        }

    });

});

app.get('/register', (request, response) => {

    response.render('users/register');

});

app.post('/register', (request, response) => {

    let text = "INSERT INTO trainer (username, password) VALUES ($1, $2);";

    let values = [request.body.username, sha256(request.body.password)];

    pool.query(text, values, (err, result) => {

        if(err) {

            console.log("register query error: ", err.message);
            response.send("ERROR");
        } else {

            response.redirect('/login');
        }

    });

});

app.post('/', (request, response) => {

    response.clearCookie('loggedIn');
    response.clearCookie('userId');
    response.redirect('/');

});

app.get('/', (request, response) => {

    let text = "SELECT * FROM pokemon;";
    let text2 = "SELECT * FROM trainer;";
    var pokemon = {};
    var check = request.cookies['loggedIn'];

    pool.query(text, (err, result) => {

        if (err) {

            console.log("error message1: ",err);
            response.send("ERROR");

        } else {

            pokemon["pokedex"] = result.rows;

            if (check !== undefined) {

                pool.query(text2, (err, result) => {

                    if (err) {
                        console.log("error message2: ", err);
                        response.send("ERROR2");

                    } else {

                        pokemon['trainerdex'] = result.rows;
                        response.render('pokemon/home', {pokemon: pokemon["pokedex"], trainer: pokemon['trainerdex']});
                    }

                });

            } else {

                response.render('pokemon/home-loggedout', {pokemon: pokemon["pokedex"]});
            }

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