import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

import personService from './services/persons';

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons);
      });
  }, []);

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.find(person => person.name.toLowerCase() === newName.toLowerCase())) {
      updatePerson(newName, newNumber)
    } else {
      const newPerson = { name: newName, number: newNumber };
      personService
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
        });
    } 
    setNewName('');
    setNewNumber('');
  };

  const updatePerson = (newName, newNumber) => {
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const id = persons.filter(person => person.name.toLowerCase() === newName.toLowerCase())[0].id;
      const updatedPerson = {
        name: newName,
        number: newNumber
      };
      personService
        .update(id, updatedPerson)
        .then(returnedPerson => {
          setPersons(persons.map(p => p.id !== id ? p : returnedPerson));
        })
        .catch(error => {
          alert(`${newName} was already deleted from server`);
        });
    }
  };

  const destroyPerson = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .destroy(person.id)
      .then(response => {
        setPersons(persons.filter(p => p.id !== person.id));
      });
    }
  };

  const nameInputHander = (event) => {
    setNewName(event.target.value);
  };

  const numberInputHandler = (event) => {
    setNewNumber(event.target.value);
  };

  const filterTextInputHandler = (event) => {
    setFilterText(event.target.value);
  };

  return (
    <>
      <h1>Phonebook</h1>
      <Filter filterText={filterText} filterTextInputHandler={filterTextInputHandler} />
      <PersonForm
        addPerson={addPerson}
        nameInputHander={nameInputHander}
        newName={newName}
        numberInputHandler={numberInputHandler}
        newNumber={newNumber}
      />
      <Persons persons={persons} filterText={filterText} destroyPerson={destroyPerson} />
    </>
  );
};

export default App;