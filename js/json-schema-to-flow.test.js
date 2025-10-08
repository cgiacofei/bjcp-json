const convert = require('./json-schema-to-flow.js')
const rootSchema = require('../json/beer.json')

test('simple schema converted to flow', () => {
  expect(
    convert({
      definitions: {
        ObjType: {
          type: 'object',
          properties: {
            strProp: { type: 'string' },
            numberProp: { type: 'number' },
            intProp: { type: 'integer' }
          }
        }
      }
    })
  ).toBe(
    `    export type ObjType = {|
        strProp?: string,
        numberProp?: number,
        intProp?: number,
    |}

`
  )
})

test('enum format', () => {
  expect(
    convert({
      definitions: {
        EnumType: {
          type: 'object',
          properties: {
            enumProp: { type: 'string', enum: ['a', 'b'] }
          }
        }
      }
    })
  ).toMatchSnapshot()
})

test('root schema type', () => {
  expect(convert(rootSchema)).toMatchSnapshot()
})

test('regexp pattern should be rendered as str', () => {
  expect(
    convert({
      definitions: {
        patternType: {
          type: 'string',
          pattern:
            '\\d{4}-\\d{2}-\\d{2}|\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}'
        }
      }
    })
  ).toMatchSnapshot()
})

test('required allOf property', () => {
  expect(
    convert({
      definitions: {
        MiscellaneousAdditionType: {
          type: 'object',
          description:
            'MiscellaneousAdditionType collects the attributes of each miscellaneous ingredient for use in a recipe',
          allOf: [
            {
              $ref: '#/definitions/MiscellaneousBase'
            },
            {
              properties: {
                timing: {
                  $ref: 'timing.json#/definitions/TimingType'
                },
                amount: {
                  oneOf: [
                    {
                      $ref: 'measureable_units.json#/definitions/VolumeType'
                    },
                    {
                      $ref: 'measureable_units.json#/definitions/MassType'
                    },
                    {
                      $ref: 'measureable_units.json#/definitions/UnitType'
                    }
                  ]
                }
              }
            }
          ],
          required: ['amount']
        }
      }
    })
  ).toMatchSnapshot()
})
