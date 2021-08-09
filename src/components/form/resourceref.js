import { Button, Form, Icon, Modal, AsyncSelect, Segment, Select } from '@waylay/react-components'
import css from '@emotion/css'
import React, { useState } from 'react'
import { useAsync } from 'react-async'
import { useModal } from 'react-modal-hook'
import ProvisioningForm from '../../containers/form/form'
import waylay from '../../lib/waylay'

const dataFetcher = async ({ resourceTypeId }) => {
  const resourceTypeIdQuery = resourceTypeId.toString().replaceAll(',', ' OR ')
  const queryString = `resourceTypeId:(${resourceTypeIdQuery})`
  return waylay.resources.search({ q: queryString })
}

const optionFilter = async (resourceTypeId, filter) => {
  const resourceTypeIdQuery = resourceTypeId.toString().replaceAll(',', ' OR ')
  let queryString = `resourceTypeId:(${resourceTypeIdQuery})`
  if (filter) queryString += ` AND id:*${filter}*`
  return waylay.resources.search({ q: queryString })
}

function ResourceField ({ field, onChange, organisation }) {
  const loadOptions = async (filter) => {
    const response = await optionFilter(field.type.resourceTypes, filter)
    return response.values.map(resource => {
      return { value: `{ "$ref": "/resources/${resource.id}" }`, label: resource.id }
    })
  }

  const handleHideModal = (form) => {
    hideModal()
    reload()
    setSelectedTypeModal(undefined)
    if (form) {
      handleUpdateValue({ value: `{ "$ref": "/resources/${form.id}" }`, label: form.name || form.id })
    }
  }

  const [selectedValue, setSelectedValue] = useState()
  const [selectedTypeModal, setSelectedTypeModal] = useState()
  const [showModal, hideModal] = useModal(() => {
    const handleModelSelectChange = ({ value }) => {
      setSelectedTypeModal(value)
    }

    const select = () => {
      if (field.type.resourceTypes.length > 1) {
        return (
          <Select placeholder='Select resourceType' onChange={handleModelSelectChange} options={field.type.resourceTypes.map((type) => ({ label: type, value: type }))} />
        )
      } else {
        setSelectedTypeModal(field.type.resourceTypes[0])
        return null
      }
    }
    return (
      <Modal isOpen css={css`width: 600px; top:80px`}>
        <Segment.Group>
          <Segment.Header css={css`width:100%;`}>
            <div style={{ width: '100%', float: 'left' }}>
              <p>{`Create new ${field.name}`} </p>
            </div>
            <div style={{ float: 'right', fontSize: '2em' }}>
              <Icon name='cancel' color='red' onClick={handleHideModal} />
            </div>
          </Segment.Header>

          <Segment>
            <div className='select-type-modal'>
              {select()}
            </div>
            <div id='content__modal'>
              <ProvisioningForm type={selectedTypeModal} key={selectedTypeModal} onSubmitOrCancel={handleHideModal} organisation={organisation} />
            </div>
          </Segment>

        </Segment.Group>
      </Modal>
    )
  }, [field.type.resourceTypes, selectedTypeModal])

  const validateField = (value) => {
    return undefined
  }

  const handleUpdateValue = (option) => {
    if (option) {
      const { value } = option
      onChange(field.name, JSON.parse(value), validateField(value))
      setSelectedValue(option)
    } else {
      onChange(field.name, undefined, validateField(undefined))
      setSelectedValue()
    }
  }

  const { isLoading, error: errorFetch, data, reload } = useAsync({
    promiseFn: dataFetcher,
    resourceTypeId: field.type.resourceTypes
  })

  if (isLoading) return (<Select loading />)
  if (errorFetch) return (<div>{errorFetch}</div>)
  if (!data) return null

  const optionData = data.values.map(resource => {
    return { value: `{ "$ref": "/resources/${resource.id}" }`, label: resource.name || resource.id }
  })
  return (
    <Form.Field key={data}>
      <div className='form-field-info'>
        <div>
          <label><p>{field.description || field.name} {field.mandatory ? <font color='red'>*</font> : null}</p></label>
        </div>
        <div className='form-field-button'>
          <Button type='button' size='tiny' onClick={showModal}>Create new {field.name}</Button>
        </div>
      </div>
      <AsyncSelect
        required={field.mandatory}
        placeholder={`Select ${field.name}`}
        onChange={handleUpdateValue}
        defaultOptions={optionData}
        loadOptions={loadOptions}
        onSelectResetsInput={false}
        isClearable
        value={selectedValue}
      />
    </Form.Field>
  )
}

export default ResourceField
