import 'should'
import { default as v } from 'validator'
import validate from '../src/index'

type ContactPerson = {
  firstName: string
  lastName: string
  email: string
}

type Customer = {
  companyName: string
  contactPerson: ContactPerson
}

const notNullOrUndefined = (str): boolean =>
  !(str === null || typeof str === 'undefined')

describe('validator', () => {
  it('should validate nested types', (done) => {
    const sut: Customer = {
      companyName: 'Acme Corp.',
      contactPerson: {
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@acme.com'
      }
    }
    const result = validate<Customer>(sut, [
      {
        prop: (p) => p.contactPerson.email,
        validations: [
          (value) => notNullOrUndefined(value),
          (value) => v.isEmail(value)
        ]
      }
    ])
    result.contactPerson.email[0].should.be.true()
    result.contactPerson.email[1].should.be.true()
    done()
  })
})
