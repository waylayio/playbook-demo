import React  from 'react'
import { Button, Message } from '@waylay/react-components'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'

function NaturalLanguageInput (props) {
    /*
    const speechGrammar = `
    #JSGF V1.0;
    grammar waylay.playbooks.nlp;
    
    <run> = ( run | init | initialize );
    <playbook> = ( alpha | beta | gamma );
    <resource> = ( x | y | z );
    <variable> = ( a | b | c );
    <value> = ( true | false | 1 | 2 | 3 | 4 | 5 );
    <parameter> = <variable> ( set to | equals ) <value>;
    <parameters> = <parameter> | ( <parameter> and <parameters> );

    public <command> = <run> <playbook> on resource <resource> [ with parameters <parameters> ];
    `
    */

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