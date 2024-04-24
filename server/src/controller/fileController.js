/**
 * This module acts as a component to control the creation,
 * read, update, and deletion of the documents in the collection.
 */
import File from "../models/Files.js";

/**
 * Adds file entry to the database.
 * @param {*} data
 * @returns {String} File entry
 */
export async function createFile(data) {
	try {
		const result = await File.create(data);
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
export async function readFiles(filter = {}, projection = null) {
	try {
		const result = await File.find(filter, projection).exec();
		return result;
	} catch (err) {
		throw err;
	}
}

/**
 * Updates file entry from the database.
 * @param {*} _id
 * @param {*} data
 * @returns {*} File Entry
 */
export async function updateFile(_id, ownedBy, data) {
	try {
		const result = await File.findOneAndUpdate({ _id, ownedBy }, data, {
			new: true,
		});
		return result;
	} catch (err) {
		throw err;
	}
}

/**
 * Delete file entry by ID
 * @param {*} _id
 * @returns {Boolean} is deleted?
 */
export async function deleteFile(_id, ownedBy) {
	try {
		await File.findOneAndDelete({ _id, ownedBy }).exec();
		return true;
	} catch (err) {
		throw err;
	}
}
