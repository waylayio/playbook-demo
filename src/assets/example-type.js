const example = {
  id: 'merged',
  name: "Constraints for resourceType 'PersonNCP'",
  description: 'The reserved keywords as defined on docs as resource constraints',
  attributes: [
    {
      name: 'name',
      required: false,
      type: {
        type: 'string'
      }
    },
    {
      name: 'Children',
      required: true,
      type: {
        type: 'array',
        elementType: {
          type: 'string'
        },
        uniqueValues: false,
        minLength: 0,
        maxLength: 20
      }
    },
    {
      name: 'tags',
      required: false,
      type: {
        type: 'array',
        elementType: {
          type: 'string'
        },
        uniqueValues: true
      }
    },
    {
      name: 'Spouse',
      required: false,
      type: {
        type: 'resourceRef',
        resourceTypes: [
          '581fdff3-dfb3-40ed-a7aa-4f84ca5375af'
        ],
        exists: false
      }
    },
    {
      name: 'firmware',
      required: false,
      type: {
        type: 'string'
      }
    },
    {
      name: 'alias',
      required: false,
      type: {
        type: 'string'
      }
    },
    {
      name: 'Age',
      required: true,
      type: {
        type: 'numeric',
        minimum: 0,
        maximum: 150
      }
    },
    {
      name: 'customer',
      required: false,
      type: {
        type: 'string'
      }
    },
    {
      name: 'metrics',
      required: false,
      type: {
        type: 'array',
        elementType: {
          type: 'object',
          attributes: [
            {
              name: 'name',
              required: true,
              type: {
                type: 'string'
              }
            },
            {
              name: 'valueType',
              required: false,
              type: {
                type: 'string'
              }
            },
            {
              name: 'valueChoices',
              required: false,
              type: {
                type: 'array',
                elementType: {
                  type: 'string'
                },
                uniqueValues: false
              }
            },
            {
              name: 'metricType',
              required: false,
              type: {
                type: 'string'
              }
            },
            {
              name: 'unit',
              required: false,
              type: {
                type: 'string'
              }
            },
            {
              name: 'minimum',
              required: false,
              type: {
                type: 'numeric'
              }
            },
            {
              name: 'maximum',
              required: false,
              type: {
                type: 'numeric'
              }
            }
          ]
        },
        uniqueValues: false
      }
    },
    {
      name: 'Gender',
      required: true,
      type: {
        type: 'enum',
        enumType: 'string',
        items: [
          'None of the above',
          'Cisgender',
          'Gender Fluid',
          'Female',
          'Male',
          'Non-binary '
        ]
      }
    },
    {
      name: 'Status',
      required: true,
      type: {
        type: 'boolean'
      }
    },
    {
      name: 'resourceTypeId',
      required: false,
      type: {
        type: 'string'
      }
    },
    {
      name: 'Name',
      required: true,
      type: {
        type: 'string',
        minLength: 2,
        maxLength: 20
      }
    },
    {
      name: 'location',
      required: false,
      type: {
        type: 'object',
        attributes: [
          {
            name: 'lat',
            required: true,
            type: {
              type: 'numeric'
            }
          },
          {
            name: 'lon',
            required: true,
            type: {
              type: 'numeric'
            }
          }
        ]
      }
    },
    {
      name: 'provider',
      required: false,
      type: {
        type: 'string'
      }
    },
    {
      name: 'lastMessageTimestamp',
      required: false,
      type: {
        type: 'numeric'
      }
    },
    {
      name: 'providerId',
      required: false,
      type: {
        type: 'string'
      }
    },
    {
      name: 'id',
      required: true,
      type: {
        type: 'string',
        minLength: 1
      }
    },
    {
      name: 'sensors',
      required: false,
      type: {
        type: 'array',
        elementType: {
          type: 'object',
          attributes: [
            {
              name: 'name',
              required: true,
              type: {
                type: 'string',
                minLength: 1
              }
            },
            {
              name: 'sensor',
              required: true,
              type: {
                type: 'object',
                attributes: [
                  {
                    name: 'name',
                    required: true,
                    type: {
                      type: 'string',
                      minLength: 1
                    }
                  },
                  {
                    name: 'version',
                    required: true,
                    type: {
                      type: 'string',
                      minLength: 1
                    }
                  },
                  {
                    name: 'properties',
                    required: false,
                    type: {
                      type: 'object',
                      attributes: []
                    }
                  }
                ]
              }
            }
          ]
        },
        uniqueValues: false,
        minLength: 1
      }
    },
    {
      name: 'owner',
      required: false,
      type: {
        type: 'string'
      }
    },
    {
      name: 'parentId',
      required: false,
      type: {
        type: 'string'
      }
    },
    {
      name: 'commands',
      required: false,
      type: {
        type: 'array',
        elementType: {
          type: 'object',
          attributes: []
        },
        uniqueValues: false,
        minLength: 1
      }
    }
  ]
}

export default example
