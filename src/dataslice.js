export default class DataSlice {
  constructor(arrayBuffer, sliceOffset, littleEndian, bigTiff) {
    this._dataView = new DataView(arrayBuffer);
    this._sliceOffset = sliceOffset;
    this._littleEndian = littleEndian;
    this._bigTiff = bigTiff;
    this._hasNativeBigInt = BigInt(1)['or'] === undefined;
  }

  get sliceOffset() {
    return this._sliceOffset;
  }

  get sliceTop() {
    return this._sliceOffset + this.buffer.byteLength;
  }

  get littleEndian() {
    return this._littleEndian;
  }

  get bigTiff() {
    return this._bigTiff;
  }

  get buffer() {
    return this._dataView.buffer;
  }

  covers(offset, length) {
    return this.sliceOffset <= offset && this.sliceTop >= offset + length;
  }

  readUint8(offset) {
    return this._dataView.getUint8(
      offset - this._sliceOffset, this._littleEndian,
    );
  }

  readInt8(offset) {
    return this._dataView.getInt8(
      offset - this._sliceOffset, this._littleEndian,
    );
  }

  readUint16(offset) {
    return this._dataView.getUint16(
      offset - this._sliceOffset, this._littleEndian,
    );
  }

  readInt16(offset) {
    return this._dataView.getInt16(
      offset - this._sliceOffset, this._littleEndian,
    );
  }

  readUint32(offset) {
    return this._dataView.getUint32(
      offset - this._sliceOffset, this._littleEndian,
    );
  }

  readInt32(offset) {
    return this._dataView.getInt32(
      offset - this._sliceOffset, this._littleEndian,
    );
  }

  readFloat32(offset) {
    return this._dataView.getFloat32(
      offset - this._sliceOffset, this._littleEndian,
    );
  }

  readFloat64(offset) {
    return this._dataView.getFloat64(
      offset - this._sliceOffset, this._littleEndian,
    );
  }

  readUint64(offset) {
    const left = this.readUint32(offset);
    const right = this.readUint32(offset + 4);
    if (!this._littleEndian) {
      if (this._hasNativeBigInt) {
        return Number(BigInt(left << 32) | BigInt(right));
      } else {
        return Number(BigInt(left << 32).or(BigInt(right)));
      }
    }
    if (this._hasNativeBigInt) {
      return Number(BigInt(right << 32) | BigInt(left));
    } else {
      return Number(BigInt(right << 32).or(BigInt(left)));
    }
  }

  readInt64(offset) {
    let left;
    let right;
    if (!this._littleEndian) {
      left = this.readInt32(offset);
      right = this.readUint32(offset + 4);

      if (this._hasNativeBigInt) {
        return Number(BigInt(left << 32) | BigInt(right));
      } else {
        return Number(BigInt(left << 32).or(BigInt(right)));
      }
    }
    left = this.readUint32(offset - this._sliceOffset);
    right = this.readInt32(offset - this._sliceOffset + 4);
    if (this._hasNativeBigInt) {
      return Number(BigInt(right << 32) | BigInt(left));
    } else {
      return Number(BigInt(right << 32).or(BigInt(left)));
    }
  }

  readOffset(offset) {
    if (this._bigTiff) {
      return this.readUint64(offset);
    }
    return this.readUint32(offset);
  }
}
