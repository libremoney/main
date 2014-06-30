
module.exports.BlockHeaderLength = 232; // BLOCK_HEADER_LENGTH = 232;
module.exports.MaxNumberOfTransactions = 255; //MAX_NUMBER_OF_TRANSACTIONS = 255;
module.exports.MaxPayloadLength = module.exports.MaxNumberOfTransactions * 160; // MAX_PAYLOAD_LENGTH = MAX_NUMBER_OF_TRANSACTIONS * 160;
module.exports.MaxBalanceLm = 1000000000; // MAX_BALANCE_NXT = 1000000000;
module.exports.OneLm = 1000; // ONE_NXT = 100000000;
module.exports.MaxBalanceMilliLm = module.exports.MaxBalanceLm * module.exports.OneLm; // MAX_BALANCE_NQT = MAX_BALANCE_NXT * ONE_NXT;
/*
module.exports.INITIAL_BASE_TARGET = 153722867;
module.exports.MAX_BASE_TARGET = MAX_BALANCE_NXT * INITIAL_BASE_TARGET;

module.exports.MAX_ALIAS_URI_LENGTH = 1000;
module.exports.MAX_ALIAS_LENGTH = 100;

module.exports.MAX_ARBITRARY_MESSAGE_LENGTH = 1000;

module.exports.MAX_ACCOUNT_NAME_LENGTH = 100;
module.exports.MAX_ACCOUNT_DESCRIPTION_LENGTH = 1000;

module.exports.MAX_ASSET_QUANTITY_QNT = 1000000000L * 100000000L;
module.exports.ASSET_ISSUANCE_FEE_NQT = 1000 * ONE_NXT;
module.exports.MIN_ASSET_NAME_LENGTH = 3;
module.exports.MAX_ASSET_NAME_LENGTH = 10;
module.exports.MAX_ASSET_DESCRIPTION_LENGTH = 1000;
module.exports.MAX_ASSET_TRANSFER_COMMENT_LENGTH = 1000;

module.exports.MAX_POLL_NAME_LENGTH = 100;
module.exports.MAX_POLL_DESCRIPTION_LENGTH = 1000;
module.exports.MAX_POLL_OPTION_LENGTH = 100;
module.exports.MAX_POLL_OPTION_COUNT = 100;

module.exports.MAX_DIGITAL_GOODS_QUANTITY = 1000000000;
module.exports.MAX_DIGITAL_GOODS_LISTING_NAME_LENGTH = 100;
module.exports.MAX_DIGITAL_GOODS_LISTING_DESCRIPTION_LENGTH = 1000;
module.exports.MAX_DIGITAL_GOODS_LISTING_TAGS_LENGTH = 100;
module.exports.MAX_DIGITAL_GOODS_NOTE_LENGTH = 1000;
module.exports.MAX_DIGITAL_GOODS_LENGTH = 1000;

module.exports.MAX_HUB_ANNOUNCEMENT_URIS = 100;
module.exports.MAX_HUB_ANNOUNCEMENT_URI_LENGTH = 1000;
module.exports.MIN_HUB_EFFECTIVE_BALANCE = 100000;

module.exports.isTestnet = false; //Nxt.getBooleanProperty("nxt.isTestnet");

module.exports.ALIAS_SYSTEM_BLOCK = 22000;
module.exports.TRANSPARENT_FORGING_BLOCK = 30000;
module.exports.ARBITRARY_MESSAGES_BLOCK = 40000;
module.exports.TRANSPARENT_FORGING_BLOCK_2 = 47000;
module.exports.TRANSPARENT_FORGING_BLOCK_3 = 51000;
module.exports.TRANSPARENT_FORGING_BLOCK_4 = 64000;
module.exports.TRANSPARENT_FORGING_BLOCK_5 = 67000;
module.exports.TRANSPARENT_FORGING_BLOCK_6 = isTestnet ? 75000 : 130000;
module.exports.TRANSPARENT_FORGING_BLOCK_7 = isTestnet ? 75000 : Integer.MAX_VALUE;
module.exports.NQT_BLOCK = isTestnet ? 76500 : 132000;
module.exports.FRACTIONAL_BLOCK = isTestnet ? NQT_BLOCK : 134000;
module.exports.ASSET_EXCHANGE_BLOCK = isTestnet ? NQT_BLOCK : 135000;
module.exports.REFERENCED_TRANSACTION_FULL_HASH_BLOCK = isTestnet ? 78000 : 140000;
module.exports.REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP = isTestnet ? 13031352 : 15134204;
module.exports.VOTING_SYSTEM_BLOCK = isTestnet ? 0 : Integer.MAX_VALUE;
module.exports.DIGITAL_GOODS_STORE_BLOCK = isTestnet ? 0 : Integer.MAX_VALUE;

module.exports.UNCONFIRMED_POOL_DEPOSIT_NQT = (isTestnet ? 50 : 100) * ONE_NXT;

module.exports.EPOCH_BEGINNING; // 20131124120000 UTC
module.exports.ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
*/
