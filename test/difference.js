let app = require('../app')
let should = require('should')

describe('app.js', () => {
  describe('#getDifference', () => {
    it('Should work arr1.length > arr2.length', () => {
      let arr1 = [{
        username: 'first'
      }, {
        username: 'second'
      }]

      let arr2 = [{
        username: 'second'
      }]

      app.getDifference.should.be.Function()

      let result = app.getDifference(arr1, arr2)

      result.should.be.Array()
      result.length.should.be.eql(1)
      result[0].should.be.Object()
      result[0].should.have.property('username')
      result[0].username.should.be.eql('first')
    })

    it('Should work arr1.length < arr2.length', () => {
      let arr2 = [{
        username: 'first'
      }, {
        username: 'second'
      }]

      let arr1 = [{
        username: 'second'
      }]

      app.getDifference.should.be.Function()

      let result = app.getDifference(arr1, arr2)

      result.should.be.Array()
      result.length.should.be.eql(1)
      result[0].should.be.Object()
      result[0].should.have.property('username')
      result[0].username.should.be.eql('first')
    })
  })
})
