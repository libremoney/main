/**!
 * LibreMoney 0.0.1
 * Author: Prof1983 <prof1983@yandex.ru>
 * License: CC0 license
 */



/*
CREATE TABLE IF NOT EXISTS block (
	db_id INT IDENTITY,
	id BIGINT NOT NULL,
	version INT NOT NULL,
	timestamp INT NOT NULL,
	previous_block_id BIGINT,
	FOREIGN KEY (previous_block_id) REFERENCES block (id) ON DELETE CASCADE,
	total_amount BIGINT NOT NULL, // сумма всего
	total_fee BIGINT NOT NULL,
	payload_length INT NOT NULL,
	generator_public_key BINARY(32) NOT NULL,
	previous_block_hash BINARY(32),
	cumulative_difficulty VARBINARY NOT NULL, //  накопленная сложность
	base_target BIGINT NOT NULL,
	next_block_id BIGINT,
	FOREIGN KEY (next_block_id) REFERENCES block (id) ON DELETE SET NULL,
	height INT NOT NULL,
	generation_signature BINARY(64) NOT NULL,
	block_signature BINARY(64) NOT NULL,
	payload_hash BINARY(32) NOT NULL,
	generator_id BIGINT NOT NULL
	);
CREATE UNIQUE INDEX IF NOT EXISTS block_id_idx ON block (id);
CREATE UNIQUE INDEX IF NOT EXISTS block_height_idx ON block (height);
CREATE INDEX IF NOT EXISTS block_generator_id_idx ON block (generator_account_id);
//UPDATE block SET total_amount = total_amount * " + Constants.ONE_NXT + " WHERE height <= " + Constants.NQT_BLOCK;
//UPDATE block SET total_fee = total_fee * " + Constants.ONE_NXT + " WHERE height <= " + Constants.NQT_BLOCK;

CREATE TABLE IF NOT EXISTS transaction (
	db_id INT IDENTITY,
	id BIGINT NOT NULL,
	deadline SMALLINT NOT NULL,
	sender_public_key BINARY(32) NOT NULL,
	recipient_id BIGINT NOT NULL,
	amount BIGINT NOT NULL,
	fee BIGINT NOT NULL,
	height INT NOT NULL,
	block_id BIGINT NOT NULL,
	FOREIGN KEY (block_id) REFERENCES block (id) ON DELETE CASCADE,
	signature BINARY(64) NOT NULL,
	timestamp INT NOT NULL,
	type TINYINT NOT NULL,
	subtype TINYINT NOT NULL,
	sender_id BIGINT NOT NULL,
	block_timestamp INT NOT NULL,
	full_hash BINARY(32) NOT NULL,
	referenced_transaction_full_hash BINARY(32),
	attachment_bytes VARBINARY
); 
CREATE UNIQUE INDEX IF NOT EXISTS transaction_id_idx ON transaction (id);
CREATE INDEX IF NOT EXISTS transaction_timestamp_idx ON transaction (timestamp);
CREATE INDEX IF NOT EXISTS transaction_sender_id_idx ON transaction (sender_account_id);
CREATE INDEX IF NOT EXISTS transaction_recipient_id_idx ON transaction (recipient_id);
CREATE UNIQUE INDEX IF NOT EXISTS transaction_full_hash_idx ON transaction (full_hash);
UPDATE transaction SET block_timestamp = (SELECT timestamp FROM block WHERE block.id = transaction.block_id);
//UPDATE transaction SET amount = amount * " + Constants.ONE_NXT + " WHERE height <= " + Constants.NQT_BLOCK;
//UPDATE transaction SET fee = fee * " + Constants.ONE_NXT + " WHERE height <= " + Constants.NQT_BLOCK;

CREATE TABLE IF NOT EXISTS peer (address VARCHAR PRIMARY KEY);
INSERT INTO peer (address) VALUES ('node.libremoney.com'), ('node.libremoney.org'), ('node.libremoney.net');
*/


function Init() {
/*
	try (Connection con = Db.getConnection(); Statement stmt = con.createStatement()) {
		int nextUpdate = 1;
		try {
			ResultSet rs = stmt.executeQuery("SELECT next_update FROM version");
			if (! rs.next()) {
				throw new RuntimeException("Invalid version table");
			}
			nextUpdate = rs.getInt("next_update");
			if (! rs.isLast()) {
				throw new RuntimeException("Invalid version table");
			}
			rs.close();
			Logger.logMessage("Database update may take a while if needed, current db version " + (nextUpdate - 1) + "...");
		} catch (SQLException e) {
			Logger.logMessage("Initializing an empty database");
			stmt.executeUpdate("CREATE TABLE version (next_update INT NOT NULL)");
			stmt.executeUpdate("INSERT INTO version VALUES (1)");
			con.commit();
		}
		update(nextUpdate);
	} catch (SQLException e) {
		throw new RuntimeException(e.toString(), e);
	}
*/
}

function Apply(sql) {
/*
	try (Connection con = Db.getConnection(); Statement stmt = con.createStatement()) {
		try {
			if (sql != null) {
				Logger.logDebugMessage("Will apply sql:\n" + sql);
				stmt.executeUpdate(sql);
			}
			stmt.executeUpdate("UPDATE version SET next_update = (SELECT next_update + 1 FROM version)");
			con.commit();
		} catch (SQLException e) {
			con.rollback();
			throw e;
		}
	} catch (SQLException e) {
		throw new RuntimeException("Database error executing " + sql, e);
	}
*/
}

function Update(nextUpdate) {
}

module.exports.Init = Init;
module.exports.Apply = Apply;
module.exports.Update = Update;
