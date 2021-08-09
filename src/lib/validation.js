import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })
ajv.addFormat('resourceRef', '^/resources/.+$')
require('ajv-keywords')(ajv)

export default ajv
