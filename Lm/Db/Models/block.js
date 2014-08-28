/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

// String | Date
// kind: { type: String, enum: ['thumbnail', 'detail'], required: true }
// unique: true,
// created: { type: Date, default: Date.now }
// time: { type: Number } 


function InitBlockModel(mongoose, modelName) {
	var schema = new mongoose.Schema({
		//properties:
		//db_id INT IDENTITY,
		id: { type: Number, required: true }, //BIGINT
		version: { type: Number, required: true }, //INT
		timestamp: { type: Number, required: true }, //INT
		previous_block_id: Number, //BIGINT
		total_amount: { type: Number, required: true }, //BIGINT
		total_fee: { type: Number, required: true }, //BIGINT
		payload_length: { type: Number, required: true }, //INT
		generator_public_key: { type: Number, required: true }, //BINARY(32)
		previous_block_hash: Number, //BINARY(32)
		cumulative_difficulty: { type: Number, required: true }, //VARBINARY
		base_target: { type: Number, required: true }, //BIGINT
		next_block_id: Number, //BIGINT
		height: { type: Number, required: true }, //INT
		generation_signature: { type: Number, required: true }, //BINARY(64)
		block_signature: { type: Number, required: true }, //BINARY(64)
		payload_hash: { type: Number, required: true }, //BINARY(32)
		generator_id: { type: Number, required: true } //BIGINT
		//FOREIGN KEY (previous_block_id) REFERENCES block (id) ON DELETE CASCADE,
		//FOREIGN KEY (next_block_id) REFERENCES block (id) ON DELETE SET NULL,


		//CREATE UNIQUE INDEX IF NOT EXISTS block_id_idx ON block (id);
		//CREATE UNIQUE INDEX IF NOT EXISTS block_height_idx ON block (height);
		//CREATE INDEX IF NOT EXISTS block_generator_id_idx ON block (generator_account_id);
	});
	return mongoose.model(modelName, schema);
};


module.exports = InitBlockModel;
