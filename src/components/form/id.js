import React from 'react'
import Creatable from 'react-select/async-creatable'
import waylay from '../../lib/waylay'
import { useAsync } from 'react-async'
import { Form, Select } from '@waylay/react-components'

const dataFetcher = async () => {
  return waylay.resources.search({  })
}

const filterFetcher = async (filter) => {
  const queryString = `id:*${filter}*`
  return waylay.resources.search({ q: queryString })
}

function ResourceIdField ({ field, onChange }) {
  const handleUpdateValue = (option) => {
    if (option) {
      const { value } = option
      onChange(field.name, value, validateField(value))
    } else {
      onChange(field.name, undefined, validateField(undefined))
    }
  }

  const loadOptions = async (filter) => {
    const response = await filterFetcher(filter)
    return response.values.map(resource => {
      return { value: resource.id, label: resource.id }
    })
  }

  const validateField = (value) => {
    return undefined
  }

  const { isLoading, error: errorFetch, data } = useAsync({
    promiseFn: dataFetcher
  })

  if (isLoading) return (<Select loading />)
  if (errorFetch) return (<div>{errorFetch}</div>)
  if (!data) return null

  const optionData = data.values.map(resource => {
    return { value: resource.id, label: resource.id }
  })

  return (
    <Form.Field>
      <div className='form-field-info'>
        <div>
          <label><p>{field.name} {field.mandatory ? <font color='red'>*</font> : null}</p></label>
        </div>
      </div>
      <Creatable
        key={data}
        required={field.mandatory}
        defaultOptions={optionData}
        onChange={handleUpdateValue}
        loadOptions={loadOptions}
        onSelectResetsInput={false}
        isClearable
        placeholder='Start typing to search existing resources'
      />
    </Form.Field>
  )
}

export default ResourceIdField
