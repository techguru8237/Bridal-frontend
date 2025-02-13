import React from 'react'

const variants = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-white/10 hover:bg-white/20 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white'
}

export const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  className = '', 
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button' 