/**!
 * LibreMoney Constants 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

exports.MaxInt = 2147483647;
exports.MinInt = -2147483648;

exports.BlockHeaderLength = 232;
exports.MaxNumberOfTransactions = 255;
exports.MaxPayloadLength = exports.MaxNumberOfTransactions * 160;
exports.MaxBalanceLm = 1000000;
exports.OneLm = 1000;
exports.MaxBalanceMilliLm = exports.MaxBalanceLm * exports.OneLm;

exports.InitialBaseTarget = 153722867;
exports.MaxBaseTarget = exports.MaxBalanceLm * exports.InitialBaseTarget;

exports.MaxAliasUriLength = 1000;
exports.MaxAliasLength = 100;

exports.MaxArbitraryMessageLength = 1000;

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

exports.MaxDigitalGoodsQuantity = 1000000000;
exports.MaxDigitalGoodsListingNameLength = 100;
exports.MaxDigitalGoodsListingDescriptionLength = 1000;
exports.MaxDigitalGoodsListingTagsLength = 100;
exports.MaxDigitalGoodsNoteLength = 1000;
exports.MaxDigitalGoodsLength = 1000;

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

exports.UnconfirmedPoolDepositMilliLm = 100 * exports.OneLm;

exports.EpochBeginning = 1400000000; // 13.05.2014 16:53:20 UTC
exports.Alphabet = "0123456789abcdefghijklmnopqrstuvwxyz"; //36
