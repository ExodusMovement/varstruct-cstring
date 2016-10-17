'use strict';

const vs = require('varstruct');

module.exports = function cstring(length, encoding = 'utf8') {
  if (!(typeof length === 'number')) {
    throw new TypeError('Value of argument "length" violates contract.\n\nExpected:\nnumber\n\nGot:\n' + _inspect(length));
  }

  let bufferCodec = vs.Buffer(length);

  function encode(value, buffer, offset) {
    function _ref(_id) {
      if (!(_id instanceof Buffer)) {
        throw new TypeError('Function "encode" return value violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(_id));
      }

      return _id;
    }

    if (!(typeof value === 'string')) {
      throw new TypeError('Value of argument "value" violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(value));
    }

    if (!(buffer == null || buffer instanceof Buffer)) {
      throw new TypeError('Value of argument "buffer" violates contract.\n\nExpected:\n?Buffer\n\nGot:\n' + _inspect(buffer));
    }

    if (!(offset == null || typeof offset === 'number')) {
      throw new TypeError('Value of argument "offset" violates contract.\n\nExpected:\n?number\n\nGot:\n' + _inspect(offset));
    }

    const buf = Buffer.alloc(length);
    // we need last byte for '\0'
    if (value.length > length - 1) throw new Error(`varstruct-cstring: '${ value }' length of ${ value.length } is greater than the buffer length - 1 of ${ length - 1 }.`);
    buf.write(value, encoding);
    return _ref(bufferCodec.encode(buf, buffer, offset));
  }

  function decode(buffer, offset, end) {
    function _ref2(_id2) {
      if (!(typeof _id2 === 'string')) {
        throw new TypeError('Function "decode" return value violates contract.\n\nExpected:\nstring\n\nGot:\n' + _inspect(_id2));
      }

      return _id2;
    }

    if (!(buffer instanceof Buffer)) {
      throw new TypeError('Value of argument "buffer" violates contract.\n\nExpected:\nBuffer\n\nGot:\n' + _inspect(buffer));
    }

    let buf = bufferCodec.decode(buffer, offset, end);
    let i = 0;
    for (; i < buf.length; i++) if (buf[i] === 0) break;
    return _ref2(buf.slice(0, i).toString(encoding));
  }

  const encodingLength = () => {
    return length;
  };

  // TODO: submit pr on varstruct if 'bytes' is undefined
  encode.bytes = decode.bytes = length;

  return { encode, decode, encodingLength };
};

function _inspect(input, depth) {
  const maxDepth = 4;
  const maxKeys = 15;

  if (depth === undefined) {
    depth = 0;
  }

  depth += 1;

  if (input === null) {
    return 'null';
  } else if (input === undefined) {
    return 'void';
  } else if (typeof input === 'string' || typeof input === 'number' || typeof input === 'boolean') {
    return typeof input;
  } else if (Array.isArray(input)) {
    if (input.length > 0) {
      if (depth > maxDepth) return '[...]';

      const first = _inspect(input[0], depth);

      if (input.every(item => _inspect(item, depth) === first)) {
        return first.trim() + '[]';
      } else {
        return '[' + input.slice(0, maxKeys).map(item => _inspect(item, depth)).join(', ') + (input.length >= maxKeys ? ', ...' : '') + ']';
      }
    } else {
      return 'Array';
    }
  } else {
    const keys = Object.keys(input);

    if (!keys.length) {
      if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
        return input.constructor.name;
      } else {
        return 'Object';
      }
    }

    if (depth > maxDepth) return '{...}';
    const indent = '  '.repeat(depth - 1);
    let entries = keys.slice(0, maxKeys).map(key => {
      return (/^([A-Z_$][A-Z0-9_$]*)$/i.test(key) ? key : JSON.stringify(key)) + ': ' + _inspect(input[key], depth) + ';';
    }).join('\n  ' + indent);

    if (keys.length >= maxKeys) {
      entries += '\n  ' + indent + '...';
    }

    if (input.constructor && input.constructor.name && input.constructor.name !== 'Object') {
      return input.constructor.name + ' {\n  ' + indent + entries + '\n' + indent + '}';
    } else {
      return '{\n  ' + indent + entries + '\n' + indent + '}';
    }
  }
}