import get from 'lodash.get'
import set from 'lodash.set'
import { Result } from 'ts-results'
import { nameof } from 'ts-simple-nameof'

export class ValidationError extends Error {
  type: string
  constructor(message: string) {
    super(message)
    this.type = 'ValidationError'
  }
}

export default function validate<T>(
  object: T,
  properties: {
    prop: (obj: T) => string
    validations: ((param) => Result<string, ValidationError>)[]
  }[]
): ValidationResult<T> {
  const result: ValidationResult<T> = {}
  properties.forEach((propertyValidation) => {
    set(
      result,
      nameof<T>(propertyValidation.prop),
      propertyValidation.validations.map((validation) =>
        validation(get(object, nameof<T>(propertyValidation.prop)))
      )
    )
  })
  return result
}

export type ValidationResult<T> =
  | {
      [K in keyof T]?: T[K] extends Record<string, unknown>
        ? ValidationResult<T[K]>
        : Result<T[K], ValidationError>[]
    }
  | never
