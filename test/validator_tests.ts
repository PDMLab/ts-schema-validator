import 'should'

import { Err, Ok } from 'ts-results'
import isEmail from 'validator/lib/isEmail'

import validate, { ValidationError } from '../src/index'

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
          (value) =>
            notNullOrUndefined(value)
              ? Ok(value)
              : Err(new ValidationError('Email must not be empty')),
          (value) =>
            value && isEmail(value)
              ? Ok(value)
              : Err(new ValidationError('Email must be an email address'))
        ]
      }
    ])
    result.email
      .some((r) => r.err && r.val.message === 'Email must not be empty')
      .should.be.true()
    result.email
      .some((r) => r.err && r.val.message === 'Email must be an email address')
      .should.be.true()
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
          (value) =>
            notNullOrUndefined(value)
              ? Ok(value)
              : Err(new ValidationError('"Email" is required')),
          (value) =>
            isEmail(value)
              ? Ok(value)
              : Err(new ValidationError('Email must an email address'))
        ]
      }
    ])
    result.contactPerson.email
      .every((r) => r.val === 'jane.doe@acme.com')
      .should.be.true()
    done()
  })
})
