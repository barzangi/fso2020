import React, { useState } from 'react';

const Filter = ({ filterText, filterTextInputHandler }) => (
  <div>
    filter show with <input type='text' onChange={filterTextInputHandler} value={filterText} />
  </div>
);

const PersonForm = ({ addPerson, nameInputHander, newName, numberInputHandler, newNumber }) => {
  return (
    <>
      <h2>Add a person</h2>
      <form onSubmit={addPerson}>
        <div>
          name: <input onChange={nameInputHander} value={newName} />
        </div>
        <div>number: <input onChange={numberInputHandler} value={newNumber} /></div>
        <div>
          <button type='submit'>add</button>
        </div>
      </form>
    </>
  );
};

const Person = ({ person, filterText }) => {
  return (
    person.name.toLowerCase().includes(filterText.toLowerCase())
    ? <div>{person.name} {person.number}</div>
    : null
  );
};

const Persons = ({ persons, filterText }) => {
  return (
    <>
      <h2>Numbers</h2>
      {persons.map(person => <Person key={person.name} person={person} filterText={filterText} />)}
    </>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterText, setFilterText] = useState('');

  const addPerson = (event) => {
    event.preventDefault();
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } else {
      const personObject = { name: newName, number: newNumber };
      setPersons(persons.concat(personObject));
    } 
    setNewName('');
    setNewNumber('');
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
      <Persons persons={persons} filterText={filterText} />
    </>
  );
};

export default App;