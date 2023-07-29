/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('connected to data base'))
    .catch(() => console.log('failed to connect to database'))

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        validate: {
            validator(v) {
                return /^(\d{2,3})-\d*$/.test(v)
            },
            message: (props) => `${props.value} is not a valid phone number!`,
        },
    },
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    },
})

module.exports = mongoose.model('Person', personSchema)
