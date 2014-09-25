/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/*
INSERT INTO peer (address) VALUES ('node.libremoney.com'), ('node.libremoney.org'), ('node.libremoney.net');
*/

function InitPeerModel(mongoose, modelName) {
	var schema = new mongoose.Schema({
		//properties:
		address: { type: String, required: true } //VARCHAR PRIMARY KEY
	});
	var peerModel = mongoose.model(modelName, schema);
	return peerModel;
};

module.exports = InitPeerModel;
