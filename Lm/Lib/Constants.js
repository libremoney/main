/**!
 * LibreMoney Constants 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Constants = {
	MaxInt: 2147483647,
	MinInt: -2147483648,

	BlockHeaderLength: 232,
	MaxNumberOfTransactions: 255,
	MaxPayloadLength: this.MaxNumberOfTransactions * 176,
	MaxBalanceLm: 1000000,
	OneLm: 1000,
	MaxBalanceMilliLm: this.MaxBalanceLm * this.OneLm,

	InitialBaseTarget: 153722867,
	MaxBaseTarget: this.MaxBalanceLm * this.InitialBaseTarget,

	MaxAliasUriLength: 1000,
	MaxAliasLength: 100,

	MaxArbitraryMessageLength: 1000,
	MaxEncryptedMessageLength: 1000,

	MaxAccountNameLength: 100,
	MaxAccountDescriptionLength: 1000,

	MaxAssetQuantityQnt: 1000000 * 1000,
	AssetIssuanceFeeMilliLm: 1000 * this.OneLm,
	MinAssetNameLength: 3,
	MaxAssetNameLength: 10,
	MaxAssetDescriptionLength: 1000,
	MaxAssetTransferCommentLength: 1000,

	MaxPollNameLength: 100,
	MaxPollDescriptionLength: 1000,
	MaxPollOptionLength: 100,
	MaxPollOptionCount: 100,

	MaxDgsQuantity: 1000000000,
	MaxDgsListingNameLength: 100,
	MaxDgsListingDescriptionLength: 1000,
	MaxDgsListingTagsLength: 100,
	MaxDgsLength: 10240,

	MaxHubAnnouncementUris: 100,
	MaxHubAnnouncementUriLength: 1000,
	MinHubEffectiveBalance: 100000,

	MinGroupNameLength: 3,
	MaxGroupNameLength: 10,
	MaxGroupDescriptionLength: 1000,

	MinUserNameLength: 3,
	MaxUserNameLength: 10,
	MaxUserDescriptionLength: 1000,

	IsTestnet: false, //Config.GetBooleanProperty("lm.isTestnet");
	IsOffline: false, //Lm.GetBooleanProperty("nxt.isOffline");

	UnconfirmedPoolDepositMilliLm: 100 * this.OneLm,

	EpochBeginning: 1400000000000, // 13.05.2014 16:53:20 UTC = Date.UTC(2014, 05, 13, 16, 53, 20, 0)
	Alphabet: "0123456789abcdefghijklmnopqrstuvwxyz", //36

	TRANSPARENT_FORGING_BLOCK: 3e4,

	StarPeers: ["node.libremoney.com:1400", "node.libremoney.net:1400"],

	Commands: {
		Addresses: "Addresses",
		AnswerOnGenerateBlock: "AnswerOnGenerateBlock",
		Block: "Block",
		Broadcast: "Broadcast",
		BroadcastGenerateBlock: "BroadcastGenerateBlock",
		GetAddresses: "GetAddresses",
		GetLastTransaction: "GetLastTransaction",
		GetNextBlock: "GetNextBlock",
		GetPrevTransaction: "GetPrevTransaction",
		GetTransactions: "GetTransactions",
		LastTransaction: "LastTransaction",
		NewBlock: "NewBlock",
		NewTransaction: "NewTransaction",
		PeerNotVerified: "PeerNotVerified",
		PeerStatus: "PeerStatus",
		Ready: "Ready",
		StopGenerateBlock: "StopGenerateBlock",
		VerifiedPeer: "VerifiedPeer",
		VerifiedPeerResponse: "VerifiedPeerResponse",
		Version: "Version",
		UnconfirmedTransactions: "UnconfirmedTransactions"
	},

	TrTypePayment: 0,
	TrTypeMessaging: 1,
	TrTypeColoredCoins: 2,
	TrTypeDigitalGoogs: 3,
	TrTypeAccountControl: 4,
	TrTypeEmission: 16
}


if (typeof module !== "undefined") {
	module.exports = Constants;
}
