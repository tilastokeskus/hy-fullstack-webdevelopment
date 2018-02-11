import express from 'express';
import validate from '../lib/validate';

export default function(resources) {
	const router = express.Router();

	router.get('/:resourceName', (req, res) => {
		const {resourceName} = req.params;
		const resource = resources[resourceName];

		if (!resource) {
			throw {status: 404, message: 'resource does not exist'};
		}

		res.json(resource.data);
	});

	router.get('/:resourceName/:id', (req, res) => {
		const {resourceName, id} = req.params;
		const resource = resources[resourceName];

		if (!resource) {
			throw {status: 404, message: 'resource does not exist'};
		}

		const record = resource.data.find(r => String(r.id) === id);

		if (!record) {
			throw {status: 404, message: 'record does not exist'};
		}

		res.json(record);
	});

	router.delete('/:resourceName/:id', (req, res) => {
		const {resourceName, id} = req.params;
		const resource = resources[resourceName];

		if (!resource) {
			throw {status: 404, message: 'resource does not exist'};
		}

		const recordIndex = resource.data.findIndex(r => String(r.id) === id);

		if (recordIndex < 0) {
			throw {status: 404, message: 'record does not exist'};
		}

		resource.data.splice(recordIndex, 1);
		res.json({status: 'ok'});
	});

	router.post('/:resourceName', (req, res) => {
		const {resourceName} = req.params;
		const resource = resources[resourceName];

		if (!resource) {
			throw {status: 404, message: 'resource does not exist'};
		}

		const data = validate(resource, req.body);

		const id = Math.floor(Math.random() * 1000000000);
		const record = {id, ...data};

		resource.data.push(record);

		res.json(record);
	});

	return router;
}