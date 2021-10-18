import 'should'

import { Err, Ok, Result } from 'ts-results'
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
    result.email[0].err &&
      result.email[0].val.message.should.equal('Email must not be empty')
    result.email[1].err &&
      result.email[1].val.message.should.equal('Email must be an email address')
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
              : Err(new ValidationError('bäm')),
          (value) =>
            isEmail(value) ? Ok(value) : Err(new ValidationError('bäm'))
        ]
      }
    ])
    result.contactPerson.email[0].val.should.equal('jane.doe@acme.com')
    result.contactPerson.email[1].val.should.equal('jane.doe@acme.com')
    done()
  })
})
