const Model = require('../../../datastore/model')

describe('Integration: Google Cloud: Datastore: Model', function() {

  it('should insert a record', async function() {

    const model = new Model({kind: 'terra_uploads_development'})

    const result = await model.insert({foo: 'baz'})

    expect(result).to.be.an('object')
    expect(result.id).to.be.a('string')

  })

})
