/*
const speechGrammar = `
#JSGF V1.0;
grammar waylay.playbooks.nlp;

<run_keyword> = ( run | init | launch );
<resource_keyword> = ( on resource | device );

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

const PLAYBOOK_REGEX = /(?<=(run|init|launch) )(?<playbook>.*?)(?= on (resource|device))/gm
const RESOURCE_REGEX = /(?<=on (resource|device) )(?<resource>.*?)(?= with parameters?| with inputs?|$)/gm
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

function marshalInputValue(value, type, format) {
    try {
        switch (type) {
            case 'integer':
                return _.toInteger(value)
            case 'double':
            case 'long':
            case 'float':
                return _.toNumber(value)
            case 'string':
                return _.toString(value)
            case 'boolean':
                return (value === 'true')
            case 'enum':
                return (format && format.values)
                    ? ( format.values.includes(value) ? value : null )
                    : value
            case 'object':
                return JSON.parse(value)
            default:       
                return value
        }
    }
    catch {
        return undefined;
    }
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

    // match the input parameters
    if (bestTemplate) {
        var matchedInputs = {}
        _.forIn(cmd.inputs, (val, key) => {
            var bestInput = findBestMatch(bestTemplate.variables, [ 'name' ], key);
            if (bestInput) {
                // marshal the value to the proper type
                matchedInputs[bestInput.name] = marshalInputValue(val, bestInput.type, bestInput.format);
            }
        })

        // update command
        cmd.inputs = matchedInputs;
        console.log(cmd)
    }
}

export {
    PlaybookLaunchCommand,
    parsePlaybookLaunchCommand,
    matchPlaybookLaunchCommandToCatalog
}
