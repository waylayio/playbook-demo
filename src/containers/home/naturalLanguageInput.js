import React  from 'react'
import { Button, Message } from '@waylay/react-components'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

function NaturalLanguageInput () {
    const {
        transcript,
        listening,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const startListening = () => {
        SpeechRecognition.startListening()
    }

    const stopListening = () => {
        SpeechRecognition.stopListening();
    }

    if (!browserSupportsSpeechRecognition) {
        return (
            <Message kind='warning' outline>Speech recognition is not supported by the current browser.</Message>
        )
    }

    return (
        <div>
            <Button 
                onMouseDown={startListening} 
                onMouseUp={stopListening} 
                style={{ width: '15%' }} 
                kind='primary' 
                loading={listening}>
                Speak command
            </Button>

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