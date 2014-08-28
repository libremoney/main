/**!
 * LibreMoney 0.1
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */

/**
 * Economic Clustering concept (EC) solves the most critical flaw of "classical" Proof-of-Stake - the problem called
 * "Nothing-at-Stake".
 *
 * I ought to respect BCNext's wish and say that this concept is inspired by Economic Majority idea of Meni Rosenfeld
 * (http://en.wikipedia.org/wiki/User:Meni_Rosenfeld).
 *
 * EC is a vital part of Transparent Forging. Words "Mining in Nxt relies on cooperation of people and even forces it"
 * (https://bitcointalk.org/index.php?topic=553205.0) were said about EC.
 *
 * Keep in mind that this concept has not been peer reviewed. You are very welcome to do it...
 *
 *                                                                              Come-from-Beyond (21.05.2014)
 */

/*
final class EconomicClustering {

    private static final Blockchain blockchain = BlockchainImpl.getInstance();

    static Block getECBlockId(int timestamp) {
        Block block = blockchain.getLastBlock();
        int distance = 0;
        while (block.getTimestamp() > timestamp - Constants.EC_RULE_TERMINATOR && distance < Constants.EC_BLOCK_DISTANCE_LIMIT) {
            block = blockchain.getBlock(block.getPreviousBlockId());
            distance += 1;
        }
        return block;
    }

    static boolean verifyFork(Transaction transaction) {
        if (blockchain.getHeight() < Constants.DIGITAL_GOODS_STORE_BLOCK) {
            return true;
        }
        if (transaction.getReferencedTransactionFullHash() != null) {
            return true;
        }
        if (blockchain.getHeight() - transaction.getECBlockHeight() > Constants.EC_BLOCK_DISTANCE_LIMIT) {
            return false;
        }
        Block ecBlock = blockchain.getBlock(transaction.getECBlockId());
        return ecBlock != null && ecBlock.getHeight() == transaction.getECBlockHeight();
    }

}
*/
