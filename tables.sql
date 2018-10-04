CREATE TABLE IF NOT EXISTS pokemon (

	id SERIAL PRIMARY KEY,
	name TEXT,
	img TEXT,
	weight TEXT,
	height TEXT

);

DROP TABLE IF EXISTS trainer;

CREATE TABLE IF NOT EXISTS trainer (

	id SERIAL PRIMARY KEY,
	username TEXT,
	password TEXT

);

DROP TABLE IF EXISTS catching;

CREATE TABLE IF NOT EXISTS catching (

	id SERIAL PRIMARY KEY,
	pokemon_id INTEGER,
	trainer_id INTEGER

);
