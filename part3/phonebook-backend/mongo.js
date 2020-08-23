const mongoose = require('mongoose');

// No password given
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://barzangi:${password}@cluster0-jbu3d.mongodb.net/2020-phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

// Information incomplete. Need both name and number
if (process.argv.length === 4) {
  console.log('Information incomplete. please provide both name and number');
  mongoose.connection.close();
  process.exit(1);
}

if (process.argv.length === 3) {
  // If only password entered, list all phonebook entries
  Person.find({}).then(result => {
    console.log('Phonebook:');
    result.forEach(person => {
      console.log(person.name, person.number);
    });
    mongoose.connection.close();
  });
} else {
  // Add new person to phonebook
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });
  person.save().then(result => {
    console.log(`Added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
}