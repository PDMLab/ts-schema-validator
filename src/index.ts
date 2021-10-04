import get from 'lodash.get'
import set from 'lodash.set'
import { nameof } from 'ts-simple-nameof'

export default function validator<T>(
  object: T,
  properties: {
    prop: (obj: T) => string
    validations: ((param) => boolean)[]
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
        : boolean[]
    }
  | never
