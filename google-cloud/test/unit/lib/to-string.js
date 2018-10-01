const toString = require('../../../lib/to-string')

describe.only('Unit: Lib: To String', function() {

  it('should convert buffer to string', function() {

    const base64String = 'eyJwa2ciOnsiaWQiOiIxMzMxM2I4MC04YWZlLTExZTgtYTUwOS0xMzkyNzViZjFkMTUiLCJmaWxlcyI6W3siZmlsZW5hbWUiOiJzb2xhcml6ZWQuemlwIiwic3RhdHVzIjoidW52ZXJpZmllZCJ9XSwic3RhdHVzIjoidW52ZXJpZmllZCIsImltYWdlU2V0VXJpcyI6WyJodHRwczovL3N0b3JhZ2UuZ29vZ2xlYXBpcy5jb20vdGVycmEtdXBsb2Fkcy1kZXZlbG9wbWVudC9zb2xhcml6ZWQuemlwIl19fQ=='
    const s = toString(base64String, 'base64')

    expect(s).to.be.a('string')

  })

})
