const mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').load();
}

mongoose.connect(process.env.MONGODB_URI);

const personSchema = new mongoose.Schema({
	name: {type: String, unique: true},
	number: String
});
const Person = mongoose.model('Person', personSchema);

if (process.argv.length > 2) {
	const name = process.argv[2];
	const number = process.argv[3];

	console.log(`lisätään henkilö ${name} numero ${number} luetteloon`);

	const person = new Person({name, number});
	person.save()
		.then(mongoose.connection.close)
		.catch(err => {
			console.log('tapahtui virhe lisättäessä henkilöä:');
			console.log(err);
			mongoose.connection.close();
		});
} else {
	Person.find({})
		.then(result => {
			console.log(`puhelinluettelo:`);
			result.forEach(p => console.log(`${p.name} ${p.number}`));
			mongoose.connection.close();
		})
		.catch(err => {
			console.log('tapahtui virhe listatessa henkilöitä:');
			console.log(err);
			mongoose.connection.close();
		});
}