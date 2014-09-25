/**!
 * LibreMoney 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function GetNextBlocks(request, peer) {
	/*
	JSONObject response = new JSONObject();

	List<Block> nextBlocks = new ArrayList<>();
	int totalLength = 0;
	Long blockId = Convert.parseUnsignedLong((String) request.get("blockId"));
	List<? extends Block> blocks = Nxt.getBlockchain().getBlocksAfter(blockId, 1440);

	for (Block block : blocks) {
		int length = Constants.BlockHeaderLength + block.getPayloadLength();
		if (totalLength + length > 1048576) {
			break;
		}
		nextBlocks.add(block);
		totalLength += length;
	}

	JSONArray nextBlocksArray = new JSONArray();
	for (Block nextBlock : nextBlocks) {
		nextBlocksArray.add(nextBlock.getJSONObject());
	}
	response.put("nextBlocks", nextBlocksArray);
	*/

	return response;
}


module.exports = GetNextBlocks;
