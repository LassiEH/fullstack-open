import { useEffect, useState } from 'react'
import personService from './services/persons'

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      filter shown with: <input value={search} onChange={handleSearchChange} />
    </div>
  )
}

const Name = ({ newName, handleNameChange }) => {
  return (
    <div>
      name: <input value={newName} onChange={handleNameChange} />
    </div>
  )
}

const Person = ({ person, handleDelete }) => {
  return (
    <li>
      {person.name} {person.number} {" "}
      <button onClick={() => handleDelete(person.id)}>delete</button>
    </li>
  )
}

const Notification = ({ message }) => {
  const notificationStyle = {
    color: 'green',
    background: 'lightgrey',
    fontsize: '20px',
    borderstyle: 'solid',
    borderradius: '5px',
    padding: '10px',
    marginbottom: '10px'
  }
  if (message === null) {
    return null
  }

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

const App = () => {
  
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [addMessage, setAddMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialNames => {
        setPersons(initialNames)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const person = { 
      name: newName, 
      number: newNumber 
    }
    if (persons.some(person => person.name === newName)) {
      const person = persons.find(n => n.name === newName)
      if (window.confirm(`${newName} is already added to phonebook, 
        replace the old number with a new one?`)) {
          const updatedPerson = { ...person, number: newNumber}

          personService
            .update(person.id, updatedPerson)
            .then((returnedPerson) => {
              setPersons(persons.map(p => p.id !== person.id ? p :returnedPerson))
              setNewName('')
              setNewNumber('')
            })
      }
    } else {
      personService
        .create(person)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
        })
      setAddMessage(
        `Added ${newName}`
      )
      setTimeout(() => {
        setAddMessage(null)
      }, 5000)
    }
  }

  const deletePerson = (id) => {
    const person = persons.find(p => p.id === id)
    if (window.confirm(`Delete ${id}`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id != id))
        })
    }
    console.log("deleted")
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message = {addMessage} />
      <div>
        <Filter search={search} handleSearchChange={handleSearchChange}/>
      </div>
      <h3>add new contact</h3>
      <form onSubmit={addName}>
        <div>
          <Name newName={newName} handleNameChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {filteredPersons.map((person) => (
          <Person 
            key={person.name} 
            person={person} 
            handleDelete={deletePerson}
          />
        ))}
      </ul>
    </div>
  )

}

export default App