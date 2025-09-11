import * as React from 'react';

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...props }) => (
  <button
    style={{
      padding: '8px 12px',
      borderRadius: 12,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}
    {...props}
  >
    {children}
  </button>
);
