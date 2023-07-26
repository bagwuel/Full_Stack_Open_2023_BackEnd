const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./mongoose')
const errorHandler = require('./error')

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "name": "Ada Lovelace", 
        "id": 2,
        "number": "39-44-5323523"
    },
    { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/api/persons', (req, res) => {
    Person.find({})
    .then(result => res.json(result))
    .catch(error => console.log(error.message))
})

app.get("/info", (req, res) => {
    Person.countDocuments({})
    .then(result => {
        res.send(
            `<p>Phonebook has info for ${result} ${result < 2 ? 'person' : 'people'}</p>
            <p>${Date()}</p>`
            )
    })
    .catch(error => console.log(error.message))    
})

app.get("/api/persons/:id", (req, res, next) => {
    const id = req.params.id
    const person = Person.findOne({_id: id})
    .then(person => {
        if (person)
            return (res.json(person))
        res.status(404).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (req, res, next) => {
    const body = req.body

    if (!body.name)
        return (res.status(400).json({error: 'name missing'}))
    const nameExists = persons.find(p => p.name === body.name)
    if (nameExists)
        return (res.status(400).json({error: 'name must be unique'}))
    if (!body.number)
        return (res.status(400).json({error: 'number missing'}))
    
    const person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save()
    .then(savedperson => res.json(savedperson))
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
    const id = req.params.id
    const {name, number} = req.body
    Person.findByIdAndUpdate(id, {name, number}, {new: true, runValidators: true, context: 'query'})
    .then(result => {res.json(result)})
    .catch(error => next(error))
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
    .then(result => {
        if (result)
            return res.status(204).send()
        res.status(404).send()
    })
    .catch(error => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})