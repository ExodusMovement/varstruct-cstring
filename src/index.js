/* @flow */
const vs = require('varstruct')

module.exports = function cstring (length: number, encoding = 'utf8') {
  let bufferCodec = vs.Buffer(length)

  function encode (value: string, buffer: ?Buffer, offset: ?number): Buffer {
    const buf = Buffer.alloc(length)
    // we need last byte for '\0'
    if (value.length > length - 1) throw new Error(`varstruct-cstring: '${value}' length of ${value.length} is greater than the buffer length - 1 of ${length - 1}.`)
    buf.write(value, encoding)
    return bufferCodec.encode(buf, buffer, offset)
  }

  function decode (buffer: Buffer, offset, end): string {
    let buf = bufferCodec.decode(buffer, offset, end)
    let i = 0
    for (; i < buf.length; i++) if (buf[i] === 0) break
    return buf.slice(0, i).toString(encoding)
  }

  const encodingLength = () => length

  // TODO: submit pr on varstruct if 'bytes' is undefined
  encode.bytes = decode.bytes = length

  return { encode, decode, encodingLength }
}
