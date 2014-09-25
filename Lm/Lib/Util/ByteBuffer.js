/*!
 * ByteBuffer
 * yoyo 2012 https://github.com/play175/ByteBuffer
 * new BSD Licensed
 */

var Type_Byte = 1;
var Type_Short = 2;
var Type_UShort = 3;
var Type_Int32 = 4;
var Type_UInt32 = 5;
var Type_String = 6;
var Type_VString = 7;
var Type_Int64 = 8;
var Type_Float = 9;
var Type_Double = 10;
var Type_ByteArray = 11;

var ByteBuffer = function (org_buf, offset) {

	var _org_buf = org_buf;
	var _encoding = 'utf8';
	var _offset = offset || 0;
	var _list = [];
	var _endian = 'B';

	this.encoding = function(encode) {
		_encoding = encode;
		return this;
	};

	this.bigEndian = function() {
	   _endian = 'B';
		return this;
	};

	this.littleEndian = function() {
	   _endian = 'L';
		return this;
	};

	this.byte = function(val, index) {
		if (val == undefined || val == null) {
		   _list.push(_org_buf.readUInt8(_offset));
		   _offset+=1;
		} else {
			if (typeof val != 'number')
				throw new Error('val is not a number');
			if (val < 0 || val > 255)
				throw new Error('value is out of bounds');
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_Byte,d:val,l:1});
			_offset += 1;
		}
		return this;
	};

	this.short = function(val,index) {
		if (val == undefined || val == null) {
		   _list.push(_org_buf['readInt16'+_endian+'E'](_offset));
		   _offset += 2;
		} else {
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_Short,d:val,l:2});
			_offset += 2;
		}
		return this;
	};

	this.ushort = function(val,index) {
		if (val == undefined || val == null) {
		   _list.push(_org_buf['readUInt16'+_endian+'E'](_offset));
		   _offset += 2;
		} else {
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_UShort,d:val,l:2});
			_offset += 2;
		}
		return this;
	};

	this.int32 = function(val, index) {
		if (val == undefined || val == null) {
		   _list.push(_org_buf['readInt32'+_endian+'E'](_offset));
		   _offset += 4;
		} else {
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_Int32,d:val,l:4});
			_offset += 4;
		}
		return this;
	};

	this.uint32 = function(val, index) {
		if (val == undefined || val == null) {
		   _list.push(_org_buf['readUInt32'+_endian+'E'](_offset));
		   _offset += 4;
		} else {
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_UInt32,d:val,l:4});
			_offset += 4;
		}
		return this;
	};

	this.string = function(val, index) {
		if (val == undefined || val == null){
		   var len = _org_buf['readInt16'+_endian+'E'](_offset);
		   _offset += 2;
		   _list.push(_org_buf.toString(_encoding, _offset, _offset+len));
		   _offset += len;
		}else{
			var len = 0;
			if (val) len = Buffer.byteLength(val, _encoding);
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_String,d:val,l:len});
			_offset += len + 2;
		}
		return this;
	};

	this.vstring = function(val, len, index) {
		if (!len) {
			throw new Error('vstring must got len argument');
			return this;
		}
		if (val == undefined || val == null) {
			var vlen = 0;
			for (var i = _offset; i<_offset +len; i++) {
				if(_org_buf[i]>0)vlen++;
			}
			_list.push(_org_buf.toString(_encoding, _offset, _offset+vlen));
			_offset += len;
		} else {
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_VString,d:val,l:len});
			_offset += len;
		}
		return this;
	};

	this.int64 = function(val, index) {
		if (typeof val != 'number')
			throw new Error('ByteBuffer: val not a number');
		if (val == undefined || val == null){
			_list.push(_org_buf['readDouble'+_endian+'E'](_offset));
			_offset += 8;
		} else {
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_Int64,d:val,l:8});
			_offset += 8;
		}
		return this;
	};

	this.float = function(val, index) {
		if (val == undefined || val == null) {
		   _list.push(_org_buf['readFloat'+_endian+'E'](_offset));
		   _offset += 4;
		} else {
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_Float,d:val,l:4});
			_offset += 4;
		}
		return this;
	};

	this.double = function(val, index) {
		if (val == undefined || val == null) {
		   _list.push(_org_buf['readDouble'+_endian+'E'](_offset));
		   _offset += 8;
		} else {
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_Double,d:val,l:8});
			_offset += 8;
		}
		return this;
	};

	this.byteArray = function(val, len, index) {
		if (val == undefined || val == null) {
			if (!len) {
				if (len != 0)
					throw new Error('byteArray must got len argument');
				return this;
			}

			var arr = [];
			for (var i = _offset; i<_offset +len; i++) {
				if (i < _org_buf.length) {
					arr.push(_org_buf.readUInt8(i));
				} else {
					arr.push(0);
				}
			}
			_list.push(arr);
		   _offset += len;
		} else {
			if (typeof len == 'undefined') {
				len = val.length
			} else {
				if (len != 0 && !len) {
					throw new Error('byteArray must got len argument');
					return this;
				}
			}
			_list.splice(index != undefined ? index : _list.length,0,{t:Type_ByteArray,d:val,l:len});
			_offset += len;
		}
		return this;
	};

	this.unpack = function() {
		return _list;
	};
	
	this.packWithHead = function() {
	  return this.pack(true);
	};

	this.pack = function(ifHead) {
		_org_buf = new Buffer((ifHead)?_offset+2:_offset);
		var offset = 0;
		if (ifHead) {
			_org_buf['writeUInt16'+_endian+'E'](_offset,offset);
			offset+=2;
		}
		for (var i = 0; i < _list.length; i++) {
			switch(_list[i].t){
				case Type_Byte:
					_org_buf.writeUInt8(_list[i].d,offset);
					offset+=_list[i].l;
					break;
				case Type_Short:
					_org_buf['writeInt16'+_endian+'E'](_list[i].d,offset);
					offset+=_list[i].l;
					break;
				case Type_UShort:
					_org_buf['writeUInt16'+_endian+'E'](_list[i].d,offset);
					offset+=_list[i].l;
					break;
				case Type_Int32:
					_org_buf['writeInt32'+_endian+'E'](_list[i].d,offset);
					offset+=_list[i].l;
					break;
				case Type_UInt32:
					_org_buf['writeUInt32'+_endian+'E'](_list[i].d,offset);
					offset+=_list[i].l;
					break;
				case Type_String:
					_org_buf['writeInt16'+_endian+'E'](_list[i].l,offset);
					offset+=2;
					_org_buf.write(_list[i].d,_encoding,offset);
					offset+=_list[i].l;
					break;
				case Type_VString:
					var vlen = Buffer.byteLength(_list[i].d, _encoding);
					_org_buf.write(_list[i].d,_encoding,offset);
					for(var j = offset + vlen;j<offset+_list[i].l;j++){
						 _org_buf.writeUInt8(0,j);
					}
					offset+=_list[i].l;
					break;
				case Type_Int64:
					_org_buf['writeDouble'+_endian+'E'](_list[i].d,offset);
					offset+=_list[i].l;
					break;
				case Type_Float:
					_org_buf['writeFloat'+_endian+'E'](_list[i].d,offset);
					offset+=_list[i].l;
					break;
				case Type_Double:
					_org_buf['writeDouble'+_endian+'E'](_list[i].d,offset);
					offset+=_list[i].l;
					break;
				case Type_ByteArray:
					var indx = 0;
					for(var j = offset;j<offset+_list[i].l;j++){
						 if(indx<_list[i].d.length){
							_org_buf.writeUInt8(_list[i].d[indx],j);
						 }else{
							_org_buf.writeUInt8(0,j);
						 }
						 indx++
					}
					offset+=_list[i].l;
					break;
			}
		}
		return _org_buf;
	};
	
	this.getAvailable = function() {
		if (!_org_buf) return _offset;
		return _org_buf.length - _offset;
	};
}

module.exports = exports = ByteBuffer;
