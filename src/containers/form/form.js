import React, { useState, useEffect } from 'react'
import { Button, Form, Loader } from '@waylay/react-components'
import { useAsync } from 'react-async'
import { omit } from 'lodash'
import waylay from '../../lib/waylay'
import NumericField from '../../components/form/numeric'
import StringField from '../../components/form/string'
import EnumField from '../../components/form/enum'
import BooleanField from '../../components/form/boolean'
import ObjectField from '../../components/form/object'
import FormErrors from '../../components/common/error'
import useWindow from '../../hooks/useWindow'
import ResourceIdField from '../../components/form/id'

const dataFetcher = async ({ templateId }) => {
  if (!templateId) return

  const template = await waylay.templates.get(templateId)
  const { variables } = template

  return {
    template,
    schema: variables
  }
}

const startTaskDeffered = ([form]) => waylay.tasks.create(form)

function ProvisioningForm ({ templateId, resource, onSubmitOrCancel }) {
  const { addCustomToast } = useWindow()

  const { data: result, error, isLoading } = useAsync({
    promiseFn: dataFetcher,
    templateId,
    watch: templateId
  })

  const startTask = useAsync({
    deferFn: startTaskDeffered,
    onResolve: (response) => {
      onSubmitOrCancel(form)
      addCustomToast(`Successfully started task from template ${templateId}`, { appearance: 'success' })
    },
    onReject: (error) => {
      const message = error.response.data.error || error
      addCustomToast(`An error occurred: ${message}`, { appearance: 'error' })
      setPostError(`An error occurred: ${message}`)
    }
  })

  const [form, setForm] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [postError, setPostError] = useState('')

  useEffect(() => {
    setForm(state => ({ ...state, resourceTypeId: templateId }))
  }, [templateId])

  const handleChange = (field, value, error) => {
    setForm((state) => {
      const newState = { ...state, [field]: value }
      console.log(newState)
      return newState
    })

    return error
      ? setFormErrors(state => ({ ...state, [field]: error }))
      : setFormErrors(state => omit(state, [field]))
  }

  const handleFormSubmit = () => {
    const task = {
      'template': templateId,
      'start': true,
      'variables': { ...form },
      'parallel': true,
      'resetObservations': false,
      'name': 'test',
      'type': 'periodic',
      'resource': resource,
      'frequency': 900000,
      'tags': {}
    }
    startTask.run(task)
  }

  const handleFormCancel = () => {
    onSubmitOrCancel()
  }

  const formFieldSelecter = (field) => {
    if (field.name === 'resource') return <ResourceIdField constraint={field} onChange={handleChange}/>
    if ('format' in field) {
      switch (field.format.type) {
        case 'integer':
        case 'double':
        case 'long':
        case 'float':
          return <NumericField field={field} onChange={handleChange}/>
        case 'string':
          return <StringField field={field} onChange={handleChange}/>
        case 'boolean':
          return <BooleanField field={field} onChange={handleChange}/>
        case 'enum':
          return <EnumField field={field} onChange={handleChange}/>
        case 'object':
          return <ObjectField field={field} onChange={handleChange}/>
        default:
          return <StringField field={field} onChange={handleChange}/>
      }
    } else {
      switch (field.type) {
        case 'integer':
        case 'double':
        case 'long':
        case 'float':
          return <NumericField field={field} onChange={handleChange}/>
        case 'string':
          return <StringField field={field} onChange={handleChange}/>
        case 'boolean':
          return <BooleanField field={field} onChange={handleChange}/>
        case 'enum':
          return <EnumField field={field} onChange={handleChange}/>
        case 'object':
          return <ObjectField field={field} onChange={handleChange}/>
        default:
          return <StringField field={field} onChange={handleChange}/>
      }
    }
  }

  if (isLoading) return (<div style={{ width: '100%' }}>
    <Loader size={32} className='center-spinner'/>
  </div>)
  if (error) return <div>{`Something went wrong: ${error.message}`}</div>
  if (!result) return null

  return (
    <div id='form-wrapper'>
      <Form style={{ width: '100%' }} noValidate>
        <FormErrors errors={formErrors}/>
        {
          result.schema ? result.schema.map(field => {
            if (field) {
              return formFieldSelecter(field)
            }
            return null
          }) : null
        }
        <div>{postError}</div>
        <Form.Field style={{ paddingTop: '10px' }}>
          <Button onClick={handleFormCancel} style={{ width: '15%' }} kind='danger'>Cancel</Button>
          <Button onClick={handleFormSubmit} style={{ width: '15%' }} kind='success'>Submit</Button>
        </Form.Field>
      </Form>
    </div>
  )
}

export default ProvisioningForm
