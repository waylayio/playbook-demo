import { Button, Form, Icon, Modal, Segment } from '@waylay/react-components'
import React, { useState } from 'react'
import ReactJson from 'react-json-view'
import { useModal } from 'react-modal-hook'
import JsonEditor from '../common/jsonEditor'
import css from '@emotion/css'

function ObjectField ({ field, onChange, value }) {
  const [json, setJson] = useState(value || {})
  const [modalValue, setModalValue] = useState(JSON.stringify(value) || '{}')

  const handleModalSubmit = () => {
    onChange(field.name, JSON.parse(modalValue), validateField(modalValue))
    setJson(JSON.parse(modalValue))
    if (!validateField(modalValue)) {
      hideModal()
    }
  }

  const handleModalChange = (editor, editorChange, newModalValue) => {
    setModalValue(newModalValue)
  }

  const validateField = (value) => {
    try {
      JSON.parse(value)
    } catch (error) {
      return { content: error.toString() }
    }
  }

  const [showModal, hideModal] = useModal(() => {
    return (
      <Modal isOpen css={css`width: 600px; top:80px`}>
        <Segment.Group>
          <Segment.Header>
            <div style={{ width: '100%', float: 'left' }}>
              <p>{`Edit ${field.description || field.name}`} </p>
            </div>
            <div style={{ float: 'right', fontSize: '2em' }}>
              <Icon name='cancel' color='red' onClick={hideModal} />
            </div>
          </Segment.Header>
          <Segment>
            <JsonEditor jsonText={modalValue} onChange={handleModalChange} />
          </Segment>
        </Segment.Group>
        <Modal.Actions>
          <Button kind='success' onClick={handleModalSubmit}>
            Save
          </Button>
        </Modal.Actions>
      </Modal>
    )
  })

  const handleEdit = (edit) => {
    setJson(JSON.stringify(edit.new_value))
  }

  return (
    <div>
      <Form.Field required={field.mandatory}>
        <label><p>{field.description || field.name} {field.mandatory ? <font color='red'>*</font> : null} <Icon name='edit' onClick={showModal} /></p></label>
        <ReactJson name={field.name} src={json} onEdit={handleEdit} onAdd={handleEdit} onDelete={handleEdit} />
      </Form.Field>
    </div>
  )
}

export default ObjectField
