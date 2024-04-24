/**
 * This module acts as a component to control the creation,
 * read, update, and deletion of the documents in the collection.
 */
import User from "../models/Users.js";

/**
 * Creates a new entry in the database.
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function create(data) {
	try {
		const result = await User.create(data);
		return result._id;
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieves all entries ids from the database.
 * @returns {Promise<Document>}
 */
export async function fetchIds() {
	try {
		const results = await User.find().exec();

		// Gets all the ids
		const ids = [];
		results.forEach((element) => {
			ids.push(element._id);
		});

		return ids;
	} catch (err) {
		throw err;
	}
}

/**
 * Retrieve an entry that satisfies the specified filter.
 * @param {Object} filter
 * @param {Object} projection
 * @returns {Array<Document>}
 */
export async function read(filter = {}, projection = null) {
	try {
		const result = await User.find(filter, projection).exec();
		return result;
	} catch (err) {
		throw err;
	}
}

/**
 * Updates a single entry from the database
 * @param {Object | String} _id
 * @param {Object} data
 * @returns {Document}
 */
export async function update(_id, data) {
	try {
		const result = await User.findOneAndUpdate({ _id }, data, {
			new: true,
		});

		return result;
	} catch (err) {
		throw err;
	}
}

export async function deleteOne(_id) {
	try {
		await User.findByIdAndDelete(_id).exec();
		return true;
	} catch (err) {
		throw err;
	}
}
