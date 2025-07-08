import React from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'bc-connect': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        ref?: React.Ref<any>;
        open?: string;
        'app-name'?: string;
        'app-description'?: string;
        'app-icon-url'?: string;
        closable?: string;
      };
    }
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'bc-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
} 