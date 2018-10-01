const createTransaction = require('./transaction')
const createDatastore = require('./create-instance')
const uuid = require('@asher/uuid')

class Model {

  constructor(options = {}) {

    this._key = null
    this.kind = (options.kind) ? options.kind.toLowerCase() : null
    this.id = options.id

    this.datastore = createDatastore({namespace: options.namespace})
    //console.error('this.kind', this.kind)
    //console.error('this.namespace', options.namespace || process.env.GLCOUD_DATASTORE_NAMESPACE)
    if(typeof this.kind != 'string') {
      throw new Error('option `kind` is required.')
    }
  }

  get() {

    const key = [this.kind, this.id]

    const _key = this.datastore.key(key)

    return new Promise(async (resolve, reject) => {

      try {

        const result = await this.datastore.get(_key)

        resolve(result[0])

      }
      catch(e) {
        console.error('Could not get by id\n', e)

        reject(e)
      }

    })

  }

  getAll(options = {orderBy: false}) {

    return new Promise(async (resolve, reject) => {

      try {

        const filters = options.filters || []
        const orderBy = (typeof options.orderBy == 'boolean') ? options.orderBy : 'createdAt'

        const query = this.datastore
          .createQuery(this.kind)

        if(filters.length > 0) {

          for(let i = 0, l = filters.length; i < l; i++) {
            const filter = filters[i]
            //console.error('filter', filter)
            query.filter(...filter)
          }

        }

        if(orderBy) {
          query.order(orderBy)
        }
        //console.error('query', query)
        const result = await this.datastore.runQuery(query)
        //console.error('result', result)
        resolve(result[0])

      }
      catch(e) {
        reject(e)
      }

    })

  }

  insert(data, options = {keys: {id: true}}) {

    if(!data.id && options.keys.id) {
      data.id = uuid()
    }

    data.createdAt = new Date().toISOString()

    const key = [this.kind]
    if(data.id) {
      key.push(data.id)
    }

    const _key = this.datastore.key(key)

    const task = {
      key: _key,
      data,
    }

    return new Promise(async (resolve, reject) => {

      try {

        const result = await this.datastore.insert(task)
        //console.log('this.datastore\n', this.datastore)
        resolve(data)

      }
      catch(e) {
        console.error('Could not insert into datastore\n', e)

        reject(e)
      }

    })

  }

  insertBulk(data = []) {

    const entities = []
    const _key = this.datastore.key([this.kind])

    for(let i = 0, l = data.length; i < l; i++) {
      const item = data[i]

      const task = {
        key: _key,
        data: item,
      }

      entities.push(task)
    }

    return new Promise(async (resolve, reject) => {

      try {

        const result = await this.datastore.insert(entities)
        //console.error('result', result)
        resolve(result)

      }
      catch(e) {
        console.error('Could not insert bulk into datastore\n', e)

        reject(e)
      }

    })

  }

  update(data) {

    const key = [this.kind, this.id]

    const _key = this.datastore.key(key)

    return new Promise(async (resolve, reject) => {

      try {

        const old = await this.datastore.get(_key)

        const task = {
          key: _key,
          data: Object.assign({}, old, data)
        }

        const result = await this.datastore.update(task)

        resolve(result[0])

      }
      catch(e) {
        console.error('Could not get by id\n', e)

        reject(e)
      }

    })

  }

  upsert(data) {

    const key = [this.kind]

    if(data.id) {
      key.push(data.id)
    }

    const _key = this.datastore.key(key)

    const task = {
      key: _key,
      data,
    }

    return new Promise(async (resolve, reject) => {

      try {

        const result = await this.datastore.upsert(task)
        //const id = result[0].mutationResults[0].key.path[0].id
        const pkg = data
        //console.error('result', result)
        //const pkg = Object.assign({}, data, {id})
        //console.error('this.kind', this.kind)
        //console.error('this._key', this._key)
        //console.error('pkg', pkg)
        resolve(pkg)

      }
      catch(e) {
        console.error('Could not upsert into datastore\n', e)

        reject(e)
      }

    })

  }

  upsertBulk(data = []) {

    const entities = []

    for(let i = 0, l = data.length; i < l; i++) {
      const item = data[i]

      const key = [this.kind]

      if(item.id) {
        key.push(item.id)
      }

      const _key = this.datastore.key(key)

      const task = {
        key: _key,
        data: item,
      }

      entities.push(task)
      //entities.push(this.datastore.upsert(task))
    }

    return new Promise(async (resolve, reject) => {

      try {

        const result = await this.datastore.upsert(entities)
        //const result = await Promise.all(entities)
        //console.error('result', result)
        resolve(result)

      }
      catch(e) {
        console.error('Could not upsert bulk into datastore\n', e)

        reject(e)
      }

    })

  }

  /*
  NOTE:
  This is more of an idea for only writing the minimum.
  */
  upsertBulk0(items = [], options = {}) {

    const filters = options.filter || []
    const keys = options.keys || []
    this._key = this.datastore.key([this.kind].concat(keys))

    return new Promise(async (resolve, reject) => {

      try {

        const entities = []
        const queries = []
        for(let i = 0, l = items.length; i < l; i++) {
          const item = items[i]

          queries.push(new Promise(async (resolve, reject) => {

            try {
              const query = this.datastore
                .createQuery(this.kind)
                
              if(filters.length > 0) {

                for(let i = 0, l = filters.length; i < l; i++) {
                  const filter = filters[i](item)
                  //console.error('filter', filter)
                  query.filter(...filter)
                }

              }

              const result = await this.datastore.runQuery(query)
              //console.error('item', item)
              //console.error('result[0]', result[0])

              /*
              NOTE:
              Only save items that do not exist.
              */
              if(!result || !result[0] || !result[0][0]) {

                entities.push({
                  key: this._key,
                  data: item
                })

              }

              resolve()
            }
            catch(e) {
              reject(e)
            }

          }))
        }

        await Promise.all(queries)
        //console.error('entities', entities)

        if(entities.length > 0) {
          const result = await this.datastore.upsert(entities)
        }
        //console.error('items[0]', items[0])
        //console.error('queries_result[0][0][0]', queries_result[0][0][0])

        //
        //console.error('bulk result', result)
        /*
        TODO: Resolve list of ids inserted/upserted
        */
        resolve([])

      }
      catch(e) {
        reject(e)
      }

    })

  }

}

module.exports = Model
