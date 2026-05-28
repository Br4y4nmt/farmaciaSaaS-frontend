import React, { forwardRef } from 'react'

type TextFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  sanitize?: 'letters-only' | 'numeric' | 'none'
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ sanitize = 'none', onChange, ...props }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      let val = e.target.value

      if (sanitize === 'letters-only') {
        val = String(val).replace(/\d/g, '')
      } else if (sanitize === 'numeric') {
        val = String(val).replace(/\D/g, '')
      }

      if (onChange) {
        const fakeEvent = {
          target: {
            name: (e.target as HTMLInputElement).name,
            value: val,
            type: (e.target as HTMLInputElement).type,
            checked: (e.target as HTMLInputElement).checked,
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>

        onChange(fakeEvent)
      }
    }

    return <input ref={ref} {...props} onChange={handleChange} />
  },
)

TextField.displayName = 'TextField'

export default TextField
