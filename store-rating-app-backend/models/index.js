'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);

const env = process.env.NODE_ENV || 'development';
const configPath = path.resolve(__dirname, '..', 'config', 'config.json');
const configFile = require(configPath);
const config = configFile[env];

const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    ...config,
    // Add pool and retry options if needed
    pool: {
      max: 1,     // Limit to 1 connection for SQLite
      min: 1,
      idle: 10000,
    },
    retry: {
      max: 5,    // Retry on failures, e.g. SQLITE_BUSY
    },
    logging: console.log, // Enable query logging for debugging, disable in production
  });
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    pool: {
      max: 1,
      min: 1,
      idle: 10000,
    },
    retry: {
      max: 5,
    },
    logging: console.log,
  });
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
