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
import Fuse from 'fuse.js'
import _ from 'lodash'

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

function findBestMatch(collection, keys, searchTerm) {
    const fuse = new Fuse(collection, {
        includeScore: true,
        keys: keys
    })

    var results = fuse.search(searchTerm)
    return _.chain(results)
        .sortBy([ 'score' ])
        .map(res => res.item)
        .first()
        .value()
} 

async function matchPlaybookLaunchCommandToCatalog(cmd) {
    // match the template name
    var templates = await fetchTemplates(cmd.playbook)    
    var bestTemplate = findBestMatch(templates, [ 'name' ], cmd.playbook)
    
    // update launch command
    if (!bestTemplate) {
        cmd.error = `No catalog match found for the playbook named ${cmd.playbook}`
    }
    cmd.playbook = bestTemplate?.name

    // match the resource
    var resources = await fetchResources(cmd.resource)
    var bestResource = findBestMatch(resources.values, [ 'name' ], cmd.resource)
    
    // update launch command
    if (!bestResource) {
        cmd.error = `No digital twin match found for the resource named ${cmd.resource}`
    }
    cmd.resource = bestResource?.id
}

export {
    PlaybookLaunchCommand,
    parsePlaybookLaunchCommand,
    matchPlaybookLaunchCommandToCatalog
}
