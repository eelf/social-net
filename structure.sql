CREATE DATABASE social;

\c social

CREATE TABLE friend (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  friend_user_id BIGINT,
  request_accepted BOOL,
  UNIQUE (user_id, friend_user_id)
);

CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  user_id_to BIGINT,
  is_out BOOL,
  message TEXT,
  ts BIGINT,
  UNIQUE (user_id,user_id_to,ts)
);

CREATE TABLE timeline (
  id SERIAL PRIMARY KEY,
  user_id BIGINT,
  source_user_id BIGINT,
  message TEXT,
  ts BIGINT,
  UNIQUE (user_id,ts)
);

CREATE TABLE socialuser (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255),
  password VARCHAR(80),
  name VARCHAR(255),
  have_avatar BOOL,
  UNIQUE (email)
);

CREATE TABLE userinfo (
  user_id INT NOT NULL PRIMARY KEY,
  name VARCHAR(255),
  birthdate DATE,
  sex INT,
  description TEXT,
  city_id INT,
  family_position INT
);

CREATE TABLE city (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  lon REAL,
  lat REAL,
  UNIQUE (name)
);

CREATE TABLE hashes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  UNIQUE(name)
);

CREATE TABLE hashtimeline (
  id SERIAL PRIMARY KEY,
  hash_id BIGINT,
  timeline_id BIGINT,
  ts BIGINT
);

CREATE INDEX idx_hashid_ts ON hashtimeline (hash_id, ts);
