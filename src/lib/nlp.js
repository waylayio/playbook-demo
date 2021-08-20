/*
const speechGrammar = `
#JSGF V1.0;
grammar waylay.playbooks.nlp;

<run_keyword> = ( run | init | launch );
<resource_keyword> = ( on resource );

<playbook> = ...;
<resource> = ...;
<variable> = ...;
<value> = ...;

<param_keyword> = ( parameter | parameters | input | inputs );
<parameter> = <variable> ( set to | equals ) <value>;
<parameters> = <parameter> | ( <parameter> and <parameters> );

public <command> = <run_keyword> <playbook> <resource_keyword> <resource> [with <parameter_keyword> <parameters>];
`
*/
import waylay from './waylay'

const PLAYBOOK_REGEX = /(?<=(run|init|launch) )(?<playbook>.*?)(?= on resource)/gm
const RESOURCE_REGEX = /(?<=on resource )(?<resource>.*?)(?= with parameters?| with inputs?|$)/gm
const INPUTS_REGEX   = /(?<input>\w+) (?:set to|equals) (?<value>\w+)(?: and )?/gm

class PlaybookLaunchCommand {
    playbook = null
    resource = null
    inputs = {}
    error = null
}

function parsePlaybookLaunchCommand(transcript) {
    var cmd = new PlaybookLaunchCommand()

    // extract playbook name
    var match = PLAYBOOK_REGEX.exec(transcript)
    if (match) {
        PLAYBOOK_REGEX.lastIndex = 0
        cmd.playbook = match.groups['playbook']
    }
    else {
        cmd.error = 'No playbook name found in voice transcript.'
        return cmd
    }

    // extract resource name
    match = RESOURCE_REGEX.exec(transcript)
    if (match) {
        RESOURCE_REGEX.lastIndex = 0
        cmd.resource = match.groups['resource']
    }
    else {
        cmd.error = 'No resource name found in voice transcript.'
        return cmd    
    }

    // extract input arguments
    while ((match = INPUTS_REGEX.exec(transcript)) != null) {
        if (match.index === INPUTS_REGEX.lastIndex) {
            INPUTS_REGEX.lastIndex++
        }
        
        var input = match.groups['input']
        if (input) {
            cmd.inputs[input] = match.groups['value']
        }
    }

    return cmd
}

async function fetchTemplates(name) {
    return waylay.templates.list(name, { hits: 100 });
}

async function fetchResources(name) {
    return waylay.resources.search({q:`name:*${name}*`})
}

async function matchPlaybookLaunchCommandToCatalog(cmd) {
    // match the template name
    var templates = await fetchTemplates(cmd.playbook);
    console.log(templates);

    // match the resource
    var resources = await fetchResources(cmd.resource);
    console.log(resources);
}

export {
    PlaybookLaunchCommand,
    parsePlaybookLaunchCommand,
    matchPlaybookLaunchCommandToCatalog
}
