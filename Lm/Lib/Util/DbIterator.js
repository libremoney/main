/**!
 * LibreMoney DbIterator 0.2
 * Copyright (c) LibreMoney Team <libremoney@yandex.com>
 * CC0 license
 */


function Close() {
	this.con.close(rs, pstmt);
}

// rsReader - function(con, rs)
function DbIterator(con, pstmt, rsReader) {
	this.con = con;
	this.pstmt = pstmt;
	this.rsReader = rsReader;
	/*
	try {
		this.rs = pstmt.executeQuery();
		this.hasNext = rs.next();
	} catch (SQLException e) {
		DbUtils.close(pstmt, con);
		throw new RuntimeException(e.toString(), e);
	}
	*/
	return this;
}

function HasNext() {
	throw new Error('Not implementted');
	/*
	if (! hasNext) {
		DbUtils.close(rs, pstmt, con);
	}
	return hasNext;
	*/
}

function Next() {
	throw new Error('Not implementted');
	/*
	if (! hasNext) {
		DbUtils.close(rs, pstmt, con);
		return null;
	}
	try {
		T result = rsReader.get(con, rs);
		hasNext = rs.next();
		return result;
	} catch (Exception e) {
		DbUtils.close(rs, pstmt, con);
		throw new RuntimeException(e.toString(), e);
	}
	*/
}

function Remove() {
	throw new Error('Not implementted');
	/*
	throw new UnsupportedOperationException("Removal not suported");
	*/
}


DbIterator.prototype.Close = Close;
DbIterator.prototype.HasNext = HasNext;
DbIterator.prototype.Next = Next;
DbIterator.prototype.Remove = Remove;


if (typeof module !== "undefined") {
	module.exports = DbIterator;
}
