import { RequestHandler } from 'express'
import { createValidator } from 'express-joi-validation'
import Joi from 'joi'

const joiValidator = createValidator()

type Schema = {
  body?: Joi.Schema
  params?: Joi.Schema
  query?: Joi.Schema
}

export function validator(schema: Schema): RequestHandler[] {
  const validators: RequestHandler[] = []
  if (schema.params) validators.push(joiValidator.params(schema.params))
  if (schema.body) validators.push(joiValidator.body(schema.body))
  if (schema.query) validators.push(joiValidator.query(schema.query))
  return validators
}
