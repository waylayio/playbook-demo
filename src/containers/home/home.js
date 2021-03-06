import React, { useState } from 'react'
import { isAuthenticated } from '../../lib/auth'
import { Redirect } from 'react-router'
import MainMenu from '../../components/menu/menu'
import ProvisioningForm from '../form/form'
import SelectTemplate from './selectTemplate'
import SelectResource from './selectResource'
import NaturalLanguageInput from './naturalLanguageInput'
import { Segment, concrete, colors } from '@waylay/react-components'
import styled from '@emotion/styled'
import { parsePlaybookLaunchCommand, matchPlaybookLaunchCommandToCatalog } from '../../lib/nlp'
import useWindow from '../../hooks/useWindow'

const LayoutContainer = styled('div')`
  display: flex;
  min-height: 100vh;
  padding-left: 173px;
`

const ContentContainer = styled('div')`
  flex: 1;
  min-height: 100vh;
  flex-direction: column;
  overflow-y: auto;
  display: flex;
  background: ${colors.withWeight(concrete, 100)};
`

const SidebarContainer = styled('div')`
  height: 100vh;
  position: fixed;

  top: 0;
  left: 0;
  bottom: 0;
  background: ${colors.withWeight(concrete, 100)};
  border-right: solid 1px ${concrete};
`

function Home () {
  const { addCustomToast } = useWindow()

  const [selectedTemplate, setSelectedTemplate] = useState()
  const [selectedResource, setSelectedResource] = useState()
  const [taskVariables, setTaskVariables] = useState()

  const handleTemplateChange = (selectedOption) => {
    setSelectedTemplate(selectedOption)
  }

  const clearTemplate = () => {
    setSelectedTemplate(undefined)
    setSelectedResource(undefined)
  }

  const handleResourceChange = (selectedOption) => {
    setSelectedResource(selectedOption)
  }

  const handleNaturalLanguageTranscript = (transcript) => {
    var cmd = parsePlaybookLaunchCommand(transcript || 'run Test Playbook on resource Testbed with input threshold set to 40')
    if (cmd.error) {
      addCustomToast(cmd.error, { appearance: 'error' })
      return
    }

    matchPlaybookLaunchCommandToCatalog(cmd).then(() => {
      if (cmd.error) {
        addCustomToast(cmd.error, { appearance: 'error' })
        return
      }

      // update input forms with tokens extracted from the spoken command
      setSelectedTemplate({ value: cmd.playbook, label: cmd.playbook })
      setSelectedResource({ value: cmd.resource, label: cmd.resource })
      setTaskVariables(cmd.inputs)
    })
  }

  if (!isAuthenticated()) {
    return <Redirect to='/login'/>
  } else {
    return (
      <LayoutContainer>
        <SidebarContainer>
          <MainMenu role='menu'/>
        </SidebarContainer>
        <ContentContainer>
          <div id='main-content'>
            <div id='select-segment'>
              <NaturalLanguageInput onListening={clearTemplate} onTranscript={handleNaturalLanguageTranscript}/>
            </div>
            <div id='select-segment'>
              <p> 1. Select template</p>
              <Segment>
                <SelectTemplate onChange={handleTemplateChange} key={selectedTemplate} value={selectedTemplate}/>
              </Segment>
            </div>
            <div id='select-segment'>
              <p> 2. Select resource</p>
              <Segment>
                <SelectResource onChange={handleResourceChange} key={selectedResource} value={selectedResource}/>
              </Segment>
            </div>

            {selectedTemplate
              ? (
                <div><p> 3. Fill in parameters</p>
                  <Segment>
                    <ProvisioningForm templateId={selectedTemplate ? selectedTemplate.value : undefined}
                                      resource={selectedResource ? selectedResource.value : undefined}
                                      key={[selectedTemplate, selectedResource]} 
                                      onSubmitOrCancel={clearTemplate}
                                      inputValues={taskVariables}/>
                  </Segment>
                </div>)
              : null}
          </div>
        </ContentContainer>
      </LayoutContainer>
    )
  }
}

export default Home
