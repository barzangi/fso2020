require('dotenv').config();

const http = require('http');
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const Person = require('./models/person');

app.use(express.json());
app.use(express.static('build'));

morgan.token('data', (req, res) => JSON.stringify(req.body));
app.use(morgan(
  ':method :url :status :res[content-length] - :response-time ms :data'
));

app.use(cors());

// all persons
app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons);
  });
});

// special info page
app.get('/info', (req, res) => {
  Person.find({}).then(persons => {
    res.send(
      `
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${new Date()}</p>
      `
    );
  });
});

// return single person info
app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id).then(person => {
    res.json(person);
  });
});

// delete person
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter(person => person.id !== id);
  res.status(204).end();
});

// add person
app.post('/api/persons', (req, res) => {
  const body = req.body;
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'information incomplete'
    });
  }

  const person = new Person({
    name: body.name,
    number: body.number
  });

  person.save().then(savedPerson => {
    res.json(savedPerson);
  });
});

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});