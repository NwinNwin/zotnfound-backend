CREATE DATABASE zotnfound;

CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(500),
    type VARCHAR(50),
    location FLOAT[],
    date VARCHAR(255),
    itemDate VARCHAR(50),
    email VARCHAR(255),
    image VARCHAR(500),
    islost BOOLEAN,
    isResolved BOOLEAN,
    isHelped BOOLEAN NULL
);

CREATE TABLE leaderboard(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    points INTEGER
)