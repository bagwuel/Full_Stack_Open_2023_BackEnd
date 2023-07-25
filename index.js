const express = require('express')
const morgan = require('morgan')
const { json } = require('stream/consumers')
const cors = require('cors')

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
    res.json(persons)
})

app.get("/info", (req, res) => {
    const numOfPersons = persons.length
    res.send(
        `<p>Phonebook has info for ${numOfPersons} ${numOfPersons < 2 ? 'person' : 'people'}</p>
        <p>${Date()}</p>`
    )
})

app.get("/api/persons/:id", (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === Number(id))
    if (person)
        return (res.json(person))
    res.status(404).end()
})

app.post("/api/persons", (req, res) => {
    const body = req.body

    if (!body.name)
        return (res.status(400).json({error: 'name missing'}))
    const nameExists = persons.find(p => p.name === body.name)
    if (nameExists)
        return (res.status(400).json({error: 'name must be unique'}))
    if (!body.number)
        return (res.status(400).json({error: 'number missing'}))
    
    const person = {
        id: Math.floor(Math.random() * 9999999),
        name: body.name,
        number: body.number,
    }
    persons = [...persons, person]
    res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id)
    if (!persons.find(p => p.id === id))
        return (res.status(404).send())
    persons = persons.filter(p => p.id !== id)
    res.status(204).send()
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})