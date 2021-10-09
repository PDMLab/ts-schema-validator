[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org) [![Join the chat at https://gitter.im/pdmlab/community](https://badges.gitter.im/pdmlab/community.svg)](https://gitter.im/pdmlab/community)

# ts-schema-validator

## About

`ts-schema-validator` is a small library that allows you to validate your TypeScript objects based on their type definitions using your validation library of choice.

## Installation

```bash
yarn add ts-schema-validator
```

## Usage

Given you have a type `ContactPerson` like this:

```typescript
type ContactPerson = {
  firstName: string
  lastName: string
  email: string
}
```

You can validate its `email` property like this:

```typescript
import { default as v } from 'validator'
import validate from 'ts-schema-validator'

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
      (value) => value && v.isEmail(value)
    ]
  }
])
result.email[0].should.be.false()
```

As you're specifying the property to be validated as an expression, it is refactoring safe.

Using `ts-schema-validator`, you can also validate nested types.

Consider, the `ContactPerson` type is nested in a `Customer` type like this:

```typescript
type Customer = {
  companyName: string
  contactPerson: ContactPerson
}
```

Validation still works:

```typescript
import { default as v } from 'validator'
import validate from 'ts-schema-validator'

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
```

As you may have noticed, there's no depedency to an external testing library, so you can use whatever you want. Just make sure, you're returning `true/false` accordingly.

## Want to help?

This project is just getting off the ground and could use some help with cleaning things up and refactoring.

If you want to contribute - we'd love it! Just open an issue to work against so you get full credit for your fork. You can open the issue first so we can discuss and you can work your fork as we go along.

If you see a bug, please be so kind as to show how it's failing, and we'll do our best to get it fixed quickly.

Before sending a PR, please [create an issue](issues/new) to introduce your idea and have a reference for your PR.

We're using [conventional commits](https://www.conventionalcommits.org), so please use it for your commits as well.

Also please add tests and make sure to run `npm run lint-ts` or `yarn lint-ts`.

## License

MIT License

Copyright (c) 2021 PDMLab

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
