const Sequelize = require('sequelize')

const sequelize = new Sequelize('bookstore', 'idw', 'vandeb0703', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

module.exports = sequelize