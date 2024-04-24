/**
 * This module acts as a component to control the creation,
 * read, update, and deletion of the documents in the collection.
 */
import Institution from "../models/Institutions.js";

/**
 * Adds institution entry to the database.
 * @param {*} data
 * @returns {String} Institution entry
 */
export async function createInstitution(data) {
	try {
		const result = await Institution.create(data);
		return result;
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
export async function readInstitutions(filter = {}, projection = null) {
	try {
		const result = await Institution.find(filter, projection).exec();
		return result;
	} catch (err) {
		throw err;
	}
}

/**
 * Updates institution entry from the database.
 * @param {*} _id
 * @param {*} data
 * @returns {*} Institution Entry
 */
export async function updateInstitution(_id, data) {
	try {
		const result = await Institution.findOneAndUpdate({ _id }, data, {
			new: true,
		});
		return result;
	} catch (err) {
		throw err;
	}
}

/**
 * Delete institution entry by ID
 * @param {*} _id
 * @returns {Boolean} is deleted?
 */
export async function deleteInstitution(_id) {
	try {
		await Institution.findByIdAndDelete(_id).exec();
		return true;
	} catch (err) {
		throw err;
	}
}
