import { Button, Form, Icon, Modal, Segment } from '@waylay/react-components'
import React, { useState } from 'react'
import ReactJson from 'react-json-view'
import JsonEditor from '../common/jsonEditor'
import { useModal } from 'react-modal-hook'
import css from '@emotion/css'

function Arrayfield ({ constraint, value, onChange }) {
  const [array, setArray] = useState(value || [])
  const [modalValue, setModalValue] = useState(JSON.stringify(value) || '[]')

  const handleModalSubmit = () => {
    const error = validatefield(modalValue)
    onChange(constraint.name, JSON.parse(modalValue), error)
    setArray(JSON.parse(modalValue))
    if (!error) {
      hideModal()
    }
    // show error
  }

  const handleModalChange = (editor, editorChange, newModalValue) => {
    setModalValue(newModalValue)
  }

  const validatefield = (value) => {
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
              <p>{`Edit ${constraint.description || constraint.name}`} </p>
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
          <Button kind='success' onClick={handleModalSubmit}>Save</Button>
        </Modal.Actions>
      </Modal>
    )
  })

  const handleEdit = (edit) => {
    setArray(JSON.stringify(edit.new_value))
  }

  return (
    <div>
      <Form.field required={constraint.required}>
        <label><p>{constraint.description || constraint.name} {constraint.required ? <font color='red'>*</font> : null} <Icon name='edit' onClick={showModal} /></p></label>
        <ReactJson name={constraint.name} src={array} onEdit={handleEdit} />
      </Form.field>
    </div>
  )
}

export default Arrayfield
