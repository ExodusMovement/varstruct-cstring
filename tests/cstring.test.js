import test from 'tape'
import vstruct from 'varstruct'
import cstring from '../'

test('simple encode / decode', (t) => {
  t.plan(2)

  const strings = vstruct([
    { name: 'first', type: cstring(16) },
    { name: 'last', type: cstring(16) }
  ])

  const data = {
    first: 'Satoshi',
    last: 'Nakamoto'
  }

  const buffer = strings.encode(data)
  t.is(buffer.toString('hex'), '5361746f7368690000000000000000004e616b616d6f746f0000000000000000', 'encoded to buffer')

  const decodedData = strings.decode(buffer)
  t.same(data, decodedData, 'decoded to object')

  t.end()
})

test('encode string larger than buffer', (t) => {
  const strings = vstruct([
    { name: 'first', type: cstring(4) }
  ])

  const data = { first: 'Satoshi' }
  t.throws(() => strings.encode(data), /.*/, 'throws on when string is greater than buffer - 1')

  t.end()
})
