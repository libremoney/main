
exports.MaxInt = 2147483647;
exports.MinInt = -2147483648;

exports.BlockHeaderLength = 232; // BLOCK_HEADER_LENGTH = 232;
exports.MaxNumberOfTransactions = 255; //MAX_NUMBER_OF_TRANSACTIONS = 255;
exports.MaxPayloadLength = exports.MaxNumberOfTransactions * 160; // MAX_PAYLOAD_LENGTH = MAX_NUMBER_OF_TRANSACTIONS * 160;
exports.MaxBalanceLm = 1000000; // MAX_BALANCE_NXT = 1000000000;
exports.OneLm = 1000; // ONE_NXT = 100000000;
exports.MaxBalanceMilliLm = exports.MaxBalanceLm * exports.OneLm; // MAX_BALANCE_NQT = MAX_BALANCE_NXT * ONE_NXT;

exports.InitialBaseTarget = 153722867; //exports.INITIAL_BASE_TARGET = 153722867;
exports.MaxBaseTarget = exports.MaxBalanceLm * exports.InitialBaseTarget; //exports.MAX_BASE_TARGET = MAX_BALANCE_NXT * INITIAL_BASE_TARGET;

exports.MaxAliasUriLength = 1000; //exports.MAX_ALIAS_URI_LENGTH = 1000;
exports.MaxAliasLength = 100; //exports.MAX_ALIAS_LENGTH = 100;

exports.MaxArbitraryMessageLength = 1000; //exports.MAX_ARBITRARY_MESSAGE_LENGTH = 1000;

exports.MaxAccountNameLength = 100; //exports.MAX_ACCOUNT_NAME_LENGTH = 100;
exports.MaxAccountDescriptionLength = 1000; //exports.MAX_ACCOUNT_DESCRIPTION_LENGTH = 1000;

exports.MaxAssetQuantityQnt = 1000000 * 1000; //exports.MAX_ASSET_QUANTITY_QNT = 1000000000L * 100000000L;
exports.AssetIssuanceFeeMilliLm = 1000 * exports.OneLm; //exports.ASSET_ISSUANCE_FEE_NQT = 1000 * ONE_NXT;
exports.MinAssetNameLength = 3; //exports.MIN_ASSET_NAME_LENGTH = 3;
exports.MaxAssetNameLength = 10; //exports.MAX_ASSET_NAME_LENGTH = 10;
exports.MaxAssetSescriptionLength = 1000; //exports.MAX_ASSET_DESCRIPTION_LENGTH = 1000;
exports.MaxAssetTransferCommentLength = 1000; //exports.MAX_ASSET_TRANSFER_COMMENT_LENGTH = 1000;

exports.MaxPollNameLength = 100; // exports.MAX_POLL_NAME_LENGTH = 100;
exports.MaxPollDescriptionLength = 1000; //exports.MAX_POLL_DESCRIPTION_LENGTH = 1000;
exports.MaxPollOptionLength = 100; //exports.MAX_POLL_OPTION_LENGTH = 100;
exports.MaxPollOptionCount = 100; //exports.MAX_POLL_OPTION_COUNT = 100;

exports.MaxDigitalGoodsQuantity = 1000000000; //exports.MAX_DIGITAL_GOODS_QUANTITY = 1000000000;
exports.MaxDigitalGoodsListingNameLength = 100; //exports.MAX_DIGITAL_GOODS_LISTING_NAME_LENGTH = 100;
exports.MaxDigitalGoodsListingDescriptionLength = 1000; //exports.MAX_DIGITAL_GOODS_LISTING_DESCRIPTION_LENGTH = 1000;
exports.MaxDigitalGoodsListingTagsLength = 100; //exports.MAX_DIGITAL_GOODS_LISTING_TAGS_LENGTH = 100;
exports.MaxDigitalGoodsNoteLength = 1000; //exports.MAX_DIGITAL_GOODS_NOTE_LENGTH = 1000;
exports.MaxDigitalGoodsLength = 1000; //exports.MAX_DIGITAL_GOODS_LENGTH = 1000;

exports.MaxHubAnnouncementUris = 100; //exports.MAX_HUB_ANNOUNCEMENT_URIS = 100;
exports.MaxHubAnnouncementUriLength = 1000; //exports.MAX_HUB_ANNOUNCEMENT_URI_LENGTH = 1000;
exports.MinHubEffectiveBalance = 100000; //exports.MIN_HUB_EFFECTIVE_BALANCE = 100000;

exports.IsTestnet = false; //Nxt.getBooleanProperty("nxt.isTestnet");

exports.AliasSystemBlock = 22000; //exports.ALIAS_SYSTEM_BLOCK = 22000;
exports.TransparentForgingBlock = 30000; //exports.TRANSPARENT_FORGING_BLOCK = 30000;
exports.ArbitraryMesagesBlock = 40000; //exports.ARBITRARY_MESSAGES_BLOCK = 40000;
exports.TransparentForgingBlock2 = 47000; //exports.TRANSPARENT_FORGING_BLOCK_2 = 47000;
exports.TransparentForgingBlock3 = 51000; //exports.TRANSPARENT_FORGING_BLOCK_3 = 51000;
exports.TransparentForgingBlock4 = 64000; //exports.TRANSPARENT_FORGING_BLOCK_4 = 64000;
exports.TransparentForgingBlock5 = 67000; //exports.TRANSPARENT_FORGING_BLOCK_5 = 67000;
exports.TransparentForgingBlock6 = 130000; //exports.TRANSPARENT_FORGING_BLOCK_6 = isTestnet ? 75000 : 130000;
exports.TransparentForgingBlock7 = exports.MaxInt; //exports.TRANSPARENT_FORGING_BLOCK_7 = isTestnet ? 75000 : Integer.MAX_VALUE;
exports.NqtBlock = 132000; //exports.NQT_BLOCK = isTestnet ? 76500 : 132000;
exports.FractionalBlock = 134000; //exports.FRACTIONAL_BLOCK = isTestnet ? NQT_BLOCK : 134000;
exports.AssetExchangeBlock = 135000; //exports.ASSET_EXCHANGE_BLOCK = isTestnet ? NQT_BLOCK : 135000;
exports.ReferencedTransactionFullHashBlock = 140000; //exports.REFERENCED_TRANSACTION_FULL_HASH_BLOCK = isTestnet ? 78000 : 140000;
exports.ReferencedTransactionFullHashTimestamp = 15134204; //exports.REFERENCED_TRANSACTION_FULL_HASH_BLOCK_TIMESTAMP = isTestnet ? 13031352 : 15134204;
exports.VotingSystemBlock = exports.MaxInt; //exports.VOTING_SYSTEM_BLOCK = isTestnet ? 0 : Integer.MAX_VALUE;
exports.DigitalGoodsStoreBlock = exports.MaxInt; //exports.DIGITAL_GOODS_STORE_BLOCK = isTestnet ? 0 : Integer.MAX_VALUE;

exports.UnconfirmedPoolDepositMilliLm = 100 * exports.OneLm; //exports.UNCONFIRMED_POOL_DEPOSIT_NQT = (isTestnet ? 50 : 100) * ONE_NXT;

exports.EpochBeginning = 1400000000; //exports.EPOCH_BEGINNING; // 13.05.2014 16:53:20 UTC - LibreMoney; 20131124120000 UTC - NextCoin
exports.Alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"; //exports.ALPHABET - 36
