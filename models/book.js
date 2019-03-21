const Sequelize = require('sequelize')
const sequelize = require('../sequelize')

const book = sequelize.define('book', {
    'id': {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'isbn': { type: Sequelize.STRING},
    'name': { type: Sequelize.STRING},
    'year': { type: Sequelize.STRING},
    'author': { type: Sequelize.STRING},
    'description': { type: Sequelize.STRING},
    'image': {
        type: Sequelize.STRING,
        //Set custom getter for book image using URL
        get(){
            const image = this.getDataValue('image');
            return "/img/"+image;
        }
    },
    'createdAt': {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },    
    'updatedAt': {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },   
    
}, {
    //prevent sequelize transform table name into plural
    freezeTableName: true,
})

module.exports = book