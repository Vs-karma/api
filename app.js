const express = require('express')
const bodyParsere = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const { buildSchema } = require('graphql')

const bcrypt = require('bcryptjs')

const mongoose = require('mongoose')

const Event = require('./models/events')
const User = require('./models/user')

const app = express()
const PORT = 3000
app.use(bodyParsere.json())

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers','Content-Type')
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200)
    }
    next()
})

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            date: String! 
        }

        type User{
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            date: String!
        }

        input UserInput{
            email: String!
            password: String!
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Event.find()
                .then(events => {
                    return events.map(event => {
                        return { ...event._doc, _id: event._doc._id.toString() }
                    })
                })
                .catch(err => {
                    console.log(err)
                })
        },
        createEvent: (args) => {
            const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                date: new Date(args.eventInput.date),
                // creator: 'string'
            })
            return event.save()
                .then(result => {
                    // return User.findById("Id")
                    console.log(result)
                    return { ...result._doc, _id: event._doc._id.toString() }
                })
                // .then(user=>{
                //     if(user){
                //         throw new Error('User already exist')
                //     }
                //     user.createEvent.push()
                        // return user.save()
                // })
                .catch(err => {
                    console.log(err)
                    throw err
                });
        },
        creatUser: (args) => {
            return User.findOne({ email: args.userInput.email })
                .then(user => {
                    if (user) {
                        throw new Error("User Existed")
                    }
                    return bcrypt.hash(args.userInput.passowrd, 12)
                })
                .then(hashedPassword => {
                    console.log(hashedPassword)
                    const user = new User({
                        email: args.userInput.email,
                        passowrd: hashedPassword
                    })
                    console.log(user)
                    return user.save()
                })
                .then(result => {
                    return { ...result._doc, password: null, _id: result.id }
                })
                .catch(err => {
                    throw err
                })
        }
    },
    graphiql: true
}))

mongoose.connect(`mongodb+srv://geetaGPT:geetaGPT@geetagpt.ci7o3e6.mongodb.net/`)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Connected\nRunning on Port ${PORT}`)
        })
    })
    .catch(err => {
        console.log(err)
    })


