import React from 'react'

export const Input = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`w-full h-10 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-2 ${className}`}
      {...props}
    />
  )
})

Input.displayName = 'Input' 