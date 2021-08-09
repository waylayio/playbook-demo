import { useAsync } from 'react-async'
import waylay from '../../lib/waylay'
import { AsyncSelect, Select } from '@waylay/react-components'
import React from 'react'

const dataFetcher = async () => {
  return await waylay.templates.list('', { hits: 100 })
}

const optionFilter = async (filter) => {
  return await waylay.templates.list(filter, { hits: 100 })
}

function SelectTemplate ({ onChange, value }) {

  const loadOptions = async (filter) => {
    const response = await optionFilter(filter)
    return response.map(template => {
      return { value: template.name, label: template.name }
    })
  }

  const { data, error, isLoading } = useAsync({ promiseFn: dataFetcher })

  if (isLoading) return <Select loading/>
  if (error) return <div>{`Something went wrong: ${error.message}`}</div>

  if (!data) return null

  const optiondata = data.map(template => (
    { value: template.name, label: template.name }
  ))

  return (
    <div className='select-template'>
      <AsyncSelect
        placeholder={`Select Template`}
        onChange={onChange}
        defaultOptions={optiondata}
        loadOptions={loadOptions}
        onSelectResetsInput={false}
        isClearable
        value={value}
      />
    </div>
  )
}

export default SelectTemplate
