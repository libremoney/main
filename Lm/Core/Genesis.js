/**!
 * LibreMoney Genesis 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var Genesis = {
	GenesisBlockId: 0,
	CreatorId: 0,
	CreatorPublicKey: new Buffer("03362fbbe6611243d853507a82dbe59844d169157fcda08deb171ed238fa3e19", "hex"),
	Recipients: [2391470422895685625], // LMA-TVZT-PRDS-FB8M-4P3E4
	Amounts: [1000000],
	Signatures: [
		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		],
	BlockSignature: [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		]
}


if (typeof module !== "undefined") {
	module.exports = Genesis;
}
