import React, { forwardRef } from 'react'
import TextField from './TextField'

type PhoneFieldProps = React.InputHTMLAttributes<HTMLInputElement>

export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  ({ onChange, ...props }, ref) => {
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const val = String(e.target.value).replace(/\D/g, '').slice(0, 9)

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

    return (
      <TextField
        ref={ref}
        {...props}
        onChange={handleChange}
        inputMode="numeric"
        pattern="[0-9]{9}"
        maxLength={9}
      />
    )
  },
)

PhoneField.displayName = 'PhoneField'

export default PhoneField
