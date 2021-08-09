import {  Form, AsyncSelect, Select } from '@waylay/react-components'
import React  from 'react'
import { useAsync } from 'react-async'
import waylay from '../../lib/waylay'

const dataFetcher = async ( ) => {
  return waylay.resources.search({})
}

const optionFilter = async (filter) => {
  let queryString = `id:*${filter}*`
  return waylay.resources.search({ q: queryString })
}

function SelectResource ({ onChange, value }) {

  const loadOptions = async (filter) => {
    const response = await optionFilter(filter)
    return response.values.map(resource => {
      return { value: resource.id, label: resource.id }
    })
  }


  const { isLoading, error, data } = useAsync({
    promiseFn: dataFetcher,
  })

  if (isLoading) return (<Select loading />)
  if (error) return (<div>{`Something went wrong: ${error.message}`}</div>)
  if (!data) return null

  const optionData = data.values.map(resource => {
    return { value: resource.id, label: resource.name || resource.id }
  })
  return (
    <Form.Field key={data}>
      <AsyncSelect
        placeholder={`Select resource`}
        onChange={onChange}
        defaultOptions={optionData}
        loadOptions={loadOptions}
        onSelectResetsInput={false}
        isClearable
        value={value}
      />
    </Form.Field>
  )
}

export default SelectResource
