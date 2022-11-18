varstruct-cstring
=================

[![npm](https://img.shields.io/npm/v/varstruct-cstring.svg?style=flat-square)](https://www.npmjs.com/package/varstruct-cstring)
[![Build Status](https://img.shields.io/github/workflow/status/ExodusMovement/varstruct-cstring/CI/master?style=flat-square)](https://github.com/ExodusMovement/varstruct-cstring/actions?query=branch%3Amaster)
[![JavaScript standard style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com)

Easily encode / decode strings as [C strings](https://en.wikibooks.org/wiki/C_Programming/Strings), that is, null-terminated `\0`.
This is useful to retain compatibility with data structures written in other languages.


Install
-------

    npm i --save varstruct #must install varstruct first
    npm i --save varstruct-cstring


Example
-------

```js
const vstruct = require('varstruct')
const cstring = require('varstruct-cstring')

const strings = vstruct([
  { name: 'first', type: cstring(16) },
  { name: 'last', type: cstring(16) }
])

const data = {
  first: 'Satoshi',
  last: 'Nakamoto'
}

const buffer = strings.encode(data)
console.log(buffer.toString('hex')) // => '5361746f7368690000000000000000004e616b616d6f746f0000000000000000'

const decodedData = strings.decode(buffer)
console.dir(decodedData) // => { first: 'Satoshi', last: 'Nakamoto' }
```


License
-------

MIT Copyright Exodus Movement, Inc. 2016
