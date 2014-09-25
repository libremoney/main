/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

//transaction.block_timestamp = block.timestamp


function InitTransactionModel(mongoose, modelName) {
	var schema = new mongoose.Schema({
		//properties:
		//db_id: Number, //INT IDENTITY
		id: { type: Number, required: true }, //BIGINT
		deadline: { type: Number, required: true }, //SMALLINT
		sender_public_key: [Number], //sender_public_key: { type: [Number], required: true }, //BINARY(32)
		recipient_id: { type: Number, required: true }, //BIGINT
		amount: {type: String, required: true }, //{ type: Number, required: true }, //BIGINT
		fee: { type: Number, required: true }, //BIGINT
		height: { type: Number, required: true }, //INT
		block_id: { type: Number, required: true }, //BIGINT
		signature: [Number], //signature: { type: [Number], required: true }, //BINARY(64)
		timestamp: { type: Number, required: true }, //INT
		type: { type: Number, required: true }, //TINYINT
		subtype: { type: Number, required: true }, //TINYINT
		sender_id: { type: String, required: true }, //{ type: Number, required: true }, //BIGINT
		block_timestamp: { type: Number, required: true }, //INT
		full_hash: [Number], //full_hash: { type: [Number], required: true }, //BINARY(32)
		referenced_transaction_full_hash: [Number], //BINARY(32)
		attachment_bytes: Buffer, //VARBINARY
		version: Number,
		has_message: { type: Number, required: true }, //BOOLEAN NOT NULL DEFAULT FALSE
		has_encrypted_message: { type: Number, required: true }, //BOOLEAN NOT NULL DEFAULT FALSE
		has_public_key_announcement: { type: Number, required: true }, //BOOLEAN NOT NULL DEFAULT FALSE
		ec_block_height: Number, //INT DEFAULT NULL
		ec_block_id: Number, //BIGINT DEFAULT NULL
		has_encrypttoself_message: { type: Number, required: true } //BOOLEAN NOT NULL DEFAULT FALSE
		//FOREIGN KEY (block_id) REFERENCES block (id) ON DELETE CASCADE

		//CREATE UNIQUE INDEX IF NOT EXISTS transaction_id_idx ON transaction (id);
		//CREATE INDEX IF NOT EXISTS transaction_timestamp_idx ON transaction (timestamp);
		//CREATE INDEX IF NOT EXISTS transaction_sender_id_idx ON transaction (sender_account_id);
		//CREATE INDEX IF NOT EXISTS transaction_recipient_id_idx ON transaction (recipient_id);
		//CREATE UNIQUE INDEX IF NOT EXISTS transaction_full_hash_idx ON transaction (full_hash);
	});
	return mongoose.model(modelName, schema);
};


module.exports = InitTransactionModel;
