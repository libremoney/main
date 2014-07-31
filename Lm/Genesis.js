/**!
 * LibreMoney Genesis 0.0
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

var GENESIS_BLOCK_ID = 0;
var CREATOR_ID = 0;

var CreatorPublicKey = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	];

var Recipients = [2391470422895685625];

var Amounts = [1000000];

var Signatures = [
	//[
		//41, 115, -41, 7, 37, 21, -3, -41, 120, 119, 63, -101, 108, 48, -117, 1,
		//-43, 32, 85, 95, 65, 42, 92, -22, 123, -36, 6, -99, -61, -53, 93, 7,
		//23, 8, -30, 65, 57, -127, -2, 42, -92, -104, 11, 72, -66, 108, 17, 113,
		//99, -117, -75, 123, 110, 107, 119, -25, 67, 64, 32, 117, 111, 54, 82, -14
	//]
	];

var BlockSignature = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	];


exports.Amounts = Amounts;
exports.BlockSignature = BlockSignature;
exports.CreatorPublicKey = CreatorPublicKey;
exports.Recipients = Recipients;
exports.Signatures = Signatures;