const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt')

const UserSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please provide email']
    },
    password: {
        type: String,
        required: [true, 'Please provide password']
    },
    surname: {
        type: String,
        required: [true, 'Please provide surname']
    },
    lastname: {
        type: String,
        required: [true, 'Please provide lastname']
    },
    studentid: {
        type: String,
        required: [true, 'Please provide studentid']
    },
}) 

UserSchema.pre('save', function(next) {
    const user = this
    bcrypt.hash(user.password, 10).then(hash => {
        user.password = hash
        next()
    }).catch(error => {
        console.error(error)
    })
})

const User = mongoose.model('User', UserSchema)
module.exports = User