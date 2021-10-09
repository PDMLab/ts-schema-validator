import 'should'

import { isEmail } from 'validator'

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
  it('should validate types', (done) => {
    const sut: ContactPerson = {
      firstName: 'Jane',
      lastName: 'Doe',
      email: null
    }
    const result = validate<ContactPerson>(sut, [
      {
        prop: (c) => c.email,
        validations: [
          (value) => notNullOrUndefined(value),
          (value) => value && isEmail(value)
        ]
      }
    ])
    result.email[0].should.be.false()
    done()
  })

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
          (value) => isEmail(value)
        ]
      }
    ])
    result.contactPerson.email[0].should.be.true()
    result.contactPerson.email[1].should.be.true()
    done()
  })
})
