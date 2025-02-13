import React from 'react'

const Documentation = () => {
  const sections = [
    {
      title: 'Core UI Components',
      items: [
        {
          name: 'Button Component',
          description: 'Reusable button component with multiple variants',
          components: [
            {
              name: 'Button',
              description: 'Primary button component used throughout the application',
              props: [
                { name: 'variant', type: 'string', description: 'primary | secondary | danger' },
                { name: 'size', type: 'string', description: 'sm | md | lg' },
                { name: 'disabled', type: 'boolean', description: 'Disables button interaction' },
                { name: 'className', type: 'string', description: 'Additional CSS classes' }
              ],
              usage: `<Button variant="primary" size="md">Click Me</Button>`
            }
          ]
        },
        {
          name: 'Input Component',
          description: 'Form input components with consistent styling',
          components: [
            {
              name: 'Input',
              description: 'Text input component with built-in styling',
              props: [
                { name: 'type', type: 'string', description: 'text | email | password | tel | date' },
                { name: 'value', type: 'string', description: 'Input value' },
                { name: 'onChange', type: 'function', description: 'Change event handler' },
                { name: 'className', type: 'string', description: 'Additional CSS classes' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Customer Management',
      items: [
        {
          name: 'AddCustomerForm',
          description: 'Form for adding new customers to the system',
          components: [
            {
              name: 'Form Fields',
              description: 'Required customer information fields',
              fields: [
                { name: 'name', type: 'string', required: true },
                { name: 'surname', type: 'string', required: true },
                { name: 'address', type: 'string', required: true },
                { name: 'city', type: 'string', required: true },
                { name: 'phone', type: 'string', required: true },
                { name: 'whatsapp', type: 'string', required: false },
                { name: 'email', type: 'string', required: false },
                { name: 'weddingDate', type: 'date', required: true },
                { name: 'weddingTime', type: 'time', required: true },
                { name: 'weddingLocation', type: 'string', required: true },
                { name: 'type', type: 'string', required: true, options: ['Client', 'Prospect'] }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Payment System',
      items: [
        {
          name: 'Payment Management',
          description: 'Components and features for handling payments',
          components: [
            {
              name: 'PaymentTable',
              description: 'Table displaying payment information',
              columns: [
                { name: 'Reference', description: 'Unique payment reference' },
                { name: 'Customer', description: 'Customer name and details' },
                { name: 'Reservation Reference', description: 'Associated reservation' },
                { name: 'Amount', description: 'Payment amount' },
                { name: 'Date', description: 'Payment date' },
                { name: 'Method', description: 'Payment method' },
                { name: 'Type', description: 'Payment type' },
                { name: 'Status', description: 'Current payment status' }
              ]
            }
          ]
        }
      ]
    },
    {
      title: 'Authentication',
      items: [
        {
          name: 'Protected Routes',
          description: 'Route protection and authentication flow',
          features: [
            'Login page with form validation',
            'Protected route wrapper component',
            'Authentication state management',
            'Automatic redirect for unauthenticated users'
          ]
        }
      ]
    },
    {
      title: 'Navigation',
      items: [
        {
          name: 'Navbar',
          description: 'Main navigation component',
          features: [
            'Dashboard navigation',
            'Customers section',
            'Payments management',
            'Reservations system',
            'Items inventory',
            'Settings access',
            'Documentation'
          ],
          implementation: {
            activeState: 'Tracks current route',
            icons: 'Uses Radix UI icons',
            styling: 'Responsive with hover states'
          }
        }
      ]
    },
    {
      title: 'Data Management',
      items: [
        {
          name: 'Customer Data',
          description: 'Customer information structure',
          fields: [
            { name: 'name', type: 'string', description: 'Customer first name' },
            { name: 'surname', type: 'string', description: 'Customer last name' },
            { name: 'address', type: 'string', description: 'Physical address' },
            { name: 'city', type: 'string', description: 'City of residence' },
            { name: 'phone', type: 'string', description: 'Primary phone number' },
            { name: 'whatsapp', type: 'string', description: 'WhatsApp contact' },
            { name: 'email', type: 'string', description: 'Email address' },
            { name: 'weddingDate', type: 'date', description: 'Wedding date' },
            { name: 'weddingTime', type: 'time', description: 'Wedding time' },
            { name: 'weddingLocation', type: 'string', description: 'Wedding venue' },
            { name: 'type', type: 'string', description: 'Customer type (Client/Prospect)' }
          ]
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold text-white">Documentation</h1>

        <div className="space-y-8">
          {sections?.map((section) => (
            <div key={section.title} className="space-y-6">
              <h2 className="text-xl font-medium text-white">{section.title}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.items?.map((item) => (
                  <div 
                    key={item.name}
                    className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/10 p-6 space-y-4"
                  >
                    <h3 className="text-lg font-medium text-white">{item.name}</h3>
                    <p className="text-gray-400">{item.description}</p>

                    {item.components && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-300">Components</h4>
                        {item.components?.map((component) => (
                          <div key={component.name} className="space-y-2">
                            <h5 className="text-white font-medium">{component.name}</h5>
                            <p className="text-sm text-gray-400">{component.description}</p>
                            {component.props && (
                              <div className="mt-2 space-y-1">
                                <h6 className="text-xs font-medium text-gray-300">Props:</h6>
                                {component.props?.map((prop) => (
                                  <div key={prop.name} className="text-xs text-gray-400">
                                    <span className="text-blue-400">{prop.name}</span>
                                    <span className="text-gray-500"> ({prop.type})</span>
                                    <span> - {prop.description}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {component.fields && (
                              <div className="mt-2 space-y-1">
                                <h6 className="text-xs font-medium text-gray-300">Fields:</h6>
                                {component.fields?.map((field) => (
                                  <div key={field.name} className="text-xs text-gray-400">
                                    <span className="text-blue-400">{field.name}</span>
                                    <span className="text-gray-500"> ({field.type})</span>
                                    <span> - Required: {field.required ? 'Yes' : 'No'}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                            {component.columns && (
                              <div className="mt-2 space-y-1">
                                <h6 className="text-xs font-medium text-gray-300">Columns:</h6>
                                {component.columns?.map((column) => (
                                  <div key={column.name} className="text-xs text-gray-400">
                                    <span className="text-blue-400">{column.name}</span>
                                    <span> - {column.description}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.features && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Features</h4>
                        <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                          {item.features?.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.implementation && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Implementation Details</h4>
                        {Object.entries(item.implementation).map(([key, value]) => (
                          <div key={key} className="text-sm text-gray-400">
                            <span className="text-blue-400">{key}</span>: {value}
                          </div>
                        ))}
                      </div>
                    )}

                    {item.fields && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-300">Data Fields</h4>
                        {item.fields?.map((field) => (
                          <div key={field.name} className="text-sm text-gray-400">
                            <span className="text-blue-400">{field.name}</span>
                            <span className="text-gray-500"> ({field.type})</span>
                            <span> - {field.description}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Documentation 