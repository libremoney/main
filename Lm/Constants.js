/**!
 * LibreMoney Constants 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

exports.MaxInt = 2147483647;
exports.MinInt = -2147483648;

exports.BlockHeaderLength = 232;
exports.MaxNumberOfTransactions = 255;
exports.MaxPayloadLength = exports.MaxNumberOfTransactions * 176;
exports.MaxBalanceLm = 1000000;
exports.OneLm = 1000;
exports.MaxBalanceMilliLm = exports.MaxBalanceLm * exports.OneLm;

exports.InitialBaseTarget = 153722867;
exports.MaxBaseTarget = exports.MaxBalanceLm * exports.InitialBaseTarget;

exports.MaxAliasUriLength = 1000;
exports.MaxAliasLength = 100;

exports.MaxArbitraryMessageLength = 1000;
exports.MaxEncryptedMessageLength = 1000;

exports.MaxAccountNameLength = 100;
exports.MaxAccountDescriptionLength = 1000;

exports.MaxAssetQuantityQnt = 1000000 * 1000;
exports.AssetIssuanceFeeMilliLm = 1000 * exports.OneLm;
exports.MinAssetNameLength = 3;
exports.MaxAssetNameLength = 10;
exports.MaxAssetDescriptionLength = 1000;
exports.MaxAssetTransferCommentLength = 1000;

exports.MaxPollNameLength = 100;
exports.MaxPollDescriptionLength = 1000;
exports.MaxPollOptionLength = 100;
exports.MaxPollOptionCount = 100;

exports.MaxDgsQuantity = 1000000000;
exports.MaxDgsNameLength = 100;
exports.MaxDgsListingDescriptionLength = 1000;
exports.MaxDgsListingTagsLength = 100;
exports.MaxDgsLength = 10240;

exports.MaxHubAnnouncementUris = 100;
exports.MaxHubAnnouncementUriLength = 1000;
exports.MinHubEffectiveBalance = 100000;

exports.MinGroupNameLength = 3;
exports.MaxGroupNameLength = 10;
exports.MaxGroupDescriptionLength = 1000;

exports.MinUserNameLength = 3;
exports.MaxUserNameLength = 10;
exports.MaxUserDescriptionLength = 1000;

exports.IsTestnet = false; //Config.GetBooleanProperty("lm.isTestnet");
exports.IsOffline = false; //Lm.GetBooleanProperty("nxt.isOffline");

exports.UnconfirmedPoolDepositMilliLm = 100 * exports.OneLm;

exports.EpochBeginning = 1400000000000; // 13.05.2014 16:53:20 UTC = Date.UTC(2014, 05, 13, 16, 53, 20, 0)
exports.Alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"; //36

/* cfb: This constant defines a straight edge when "longest chain"
rule is outweighed by "economic majority" rule; the terminator
is set as number of seconds before the current time. */
exports.EC_RULE_TERMINATOR = 600;
exports.EC_BLOCK_DISTANCE_LIMIT = 60;

exports.TYPE_PAYMENT = 0;
exports.TYPE_MESSAGING = 1;
exports.TYPE_COLORED_COINS = 2;
exports.TYPE_DIGITAL_GOODS = 3;
exports.TYPE_ACCOUNT_CONTROL = 4;
exports.TYPE_EMIT = 16;
exports.TYPE_USER = 17;
exports.TYPE_PROJECT = 18;
exports.TYPE_COMMUNITY = 19;

exports.SUBTYPE_PAYMENT_ORDINARY_PAYMENT = 0;

exports.SUBTYPE_MESSAGING_ARBITRARY_MESSAGE = 0;
exports.SUBTYPE_MESSAGING_ALIAS_ASSIGNMENT = 1;
exports.SUBTYPE_MESSAGING_POLL_CREATION = 2;
exports.SUBTYPE_MESSAGING_VOTE_CASTING = 3;
exports.SUBTYPE_MESSAGING_HUB_ANNOUNCEMENT = 4;
exports.SUBTYPE_MESSAGING_ACCOUNT_INFO = 5;

exports.SUBTYPE_COLORED_COINS_ASSET_ISSUANCE = 0;
exports.SUBTYPE_COLORED_COINS_ASSET_TRANSFER = 1;
exports.SUBTYPE_COLORED_COINS_ASK_ORDER_PLACEMENT = 2;
exports.SUBTYPE_COLORED_COINS_BID_ORDER_PLACEMENT = 3;
exports.SUBTYPE_COLORED_COINS_ASK_ORDER_CANCELLATION = 4;
exports.SUBTYPE_COLORED_COINS_BID_ORDER_CANCELLATION = 5;

exports.SUBTYPE_DIGITAL_GOODS_LISTING = 0;
exports.SUBTYPE_DIGITAL_GOODS_DELISTING = 1;
exports.SUBTYPE_DIGITAL_GOODS_PRICE_CHANGE = 2;
exports.SUBTYPE_DIGITAL_GOODS_QUANTITY_CHANGE = 3;
exports.SUBTYPE_DIGITAL_GOODS_PURCHASE = 4;
exports.SUBTYPE_DIGITAL_GOODS_DELIVERY = 5;
exports.SUBTYPE_DIGITAL_GOODS_FEEDBACK = 6;
exports.SUBTYPE_DIGITAL_GOODS_REFUND = 7;

exports.SUBTYPE_ACCOUNT_CONTROL_EFFECTIVE_BALANCE_LEASING = 0;

exports.SUBTYPE_EMIT_EMISSION = 0;

exports.SUBTYPE_USER_CREATE = 0;

exports.SUBTYPE_PROJECT_CREATE = 0;
exports.SUBTYPE_PROJECT_ANNOUNCE = 1;
exports.SUBTYPE_PROJECT_EDIT = 2;
exports.SUBTYPE_PROJECT_BEGIN = 3;

exports.SUBTYPE_GROUP_CREATE = 0;
