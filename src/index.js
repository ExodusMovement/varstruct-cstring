/* @flow */
const vs = require('varstruct')

module.exports = function cstring (length: number, encoding = 'utf8') {
  const bufferCodec = vs.Buffer(length)

  function encode (value: string, buffer: ?Buffer, offset: ?number): Buffer {
    const buf = Buffer.alloc(length)
    // we need last byte for '\0'
    if (value.length > length - 1) throw new Error(`varstruct-cstring: '${value}' length of ${value.length} is greater than the buffer length - 1 of ${length - 1}.`)
    buf.write(value, encoding)
    return bufferCodec.encode(buf, buffer, offset)
  }

  function decode (buffer: Buffer, offset, end): string {
    const buf = bufferCodec.decode(buffer, offset, end)
    const i = buf.indexOf(0)
    const sbuf = i === -1 ? buf : buf.slice(0, i)
    return sbuf.toString(encoding)
  }

  const encodingLength = () => length

  // TODO: submit pr on varstruct if 'bytes' is undefined
  encode.bytes = decode.bytes = length

  return { encode, decode, encodingLength }
}
