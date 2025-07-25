require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())

const Person = require('./models/person')

morgan.token('body', (request) => {
    return request.method === 'POST' ? JSON.stringify(request.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: error.message })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.number === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}


let persons = [
    {
        id: "1",
        name: "Arto Hellas",
        number: "040-123456"
    },
    {
        id: "2",
        name: "Ada Lovelace",
        number: "39-44-5323523"
    },
    {
        id: "3",
        name: "Dan Abramov",
        number: "12-43-234345"
    },
    {
        id: "4",
        name: "Mary Poppendieck",
        number: "39-23-6423122"
    }
]

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.floor(Math.random() * 500)
        : 0
    return String(maxId)
}

app.get('/info', (request, response) => {
    const time = new Date()
    value = persons.length
    response.send(`Phonebook has info for ${value} people<br>${time}`)
})

app.get('/api/persons', (request, response) => {
    //response.json(persons)
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response) => {
    Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )

    .then((updatedPerson) => {
      response.json(updatedPerson)
    })
    .catch((error) => next(error))
})


app.post('/api/persons', (request, response, next) => {
    const body = request.body
    const nameInList = persons.find(n => n.name === body.name)

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number missing'
        })
    }

    if (nameInList) {
        return response.status(400).json({
            error: 'name  must be unique'
        })
    }

    const person = new Person ({
        id: generateId(),
        name: body.name,
        number: body.number
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
    .catch((error) => next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
