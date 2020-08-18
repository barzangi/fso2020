import React, { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

import personService from './services/persons';

const initNotification = {
  message: null,
  type: true
};

const Notification = ({ notification }) => {
  if (notification.message === null) return null;
  const style = notification.type ? { color: 'green' } : { color: 'red' };
  return (
    <div className='notification' style={style}>
      {notification.message}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterText, setFilterText] = useState('');
  const [notification, setNotification] = useState(initNotification);

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
          setNotification({
            message: `Added ${returnedPerson.name}`,
            type: true
          });
          setTimeout(() => {
            setNotification({ message: null });
          }, 4000);
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
          setNotification({
            message: `Updated ${newName}'s number to ${newNumber}`,
            type: true
          });
          setTimeout(() => {
            setNotification({ message: null });
          }, 4000);
        })
        .catch(error => {
          setNotification({
            message: `Info on ${newName} has already been removed from server`,
            type: false
          });
          setTimeout(() => {
            setNotification({ message: null });
          }, 4000);
          setPersons(persons.filter(p => p.id !== id));
        });
    }
  };

  const destroyPerson = person => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
      .destroy(person.id)
      .then(response => {
        setPersons(persons.filter(p => p.id !== person.id));
        setNotification({
          message: `Deleted ${person.name}`,
          type: true
        });
        setTimeout(() => {
          setNotification({ message: null });
        }, 4000);
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
      <Notification notification={notification} />
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