import React  from 'react'
import { Button, Message, Tooltip } from '@waylay/react-components'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

function NaturalLanguageInput (props) {
    const {
        transcript,
        listening,
        resetTranscript
    } = useSpeechRecognition();

    const startListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true })
    }

    const stopListening = () => {
        SpeechRecognition.stopListening();

        // call onTranscript handler if set
        if (props.onTranscript) {
            props.onTranscript(transcript);
        }
    }

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return (
            <Message kind='warning' outline>Speech recognition is not supported by the current browser.</Message>
        )
    }

    return (
        <div>
            <Tooltip placement="right" hideOnClick="false" content="run <playbook> on resource <resource> with inputs <a> set to <X> and <b> set to <Y> and <c> equals <Z>">
                <Button 
                    onMouseDown={startListening} 
                    onMouseUp={stopListening} 
                    style={{ width: '15%' }} 
                    kind='primary' 
                    loading={listening}>
                    Speak command
                </Button>
            </Tooltip>

            { transcript
                ? ( <div>
                        <br/>
                        <Message outline>{transcript}</Message>
                    </div> ) 
                : null }
        </div>  
    )
}

export default NaturalLanguageInput