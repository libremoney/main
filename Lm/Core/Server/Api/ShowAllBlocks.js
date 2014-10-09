/**!
 * LibreMoney ShowAllBlocks api 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

if (typeof module !== "undefined") {
	var BlockDb = require(__dirname + '/../../Blocks/BlockDb');
}

function ShowAllBlocks(req, res) {
	BlockDb.GetLastBlocksList(25, function(res) {
		throw 'Not implementted';
		/*
		var data = [];
		async.eachSeries(res, function(blockData, _callback) {
			var block = new Block(blockData);
			BlockDb.findRelatedTransactions(block, function(block) {
				data.push(block.getDataWithTransactions());
				_callback()
			})
		}, function(err) {
			if (err) {
				ResponseHelper.end500(res, err)
			} else {
				res.writeHead(200, {
					"Content-Type": "text/plain"
				});
				res.write(JSON.stringify(data));
				res.end();
			}
		});
		*/
	});
}

if (typeof module !== "undefined") {
	module.exports = BlockHandlers;
}
