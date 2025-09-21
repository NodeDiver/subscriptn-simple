"use client";

import { useEffect } from 'react';

export default function HydrationFix() {
  useEffect(() => {
    // Clean up browser extension attributes that cause hydration mismatches
    const body = document.body;
    
    // Remove Grammarly attributes
    if (body.hasAttribute('data-new-gr-c-s-check-loaded')) {
      body.removeAttribute('data-new-gr-c-s-check-loaded');
    }
    if (body.hasAttribute('data-gr-ext-installed')) {
      body.removeAttribute('data-gr-ext-installed');
    }
    
    // Remove ColorZilla attribute
    if (body.hasAttribute('cz-shortcut-listen')) {
      body.removeAttribute('cz-shortcut-listen');
    }
    
    // Remove any other common extension attributes
    const extensionAttributes = [
      'data-grammarly-shadow-root',
      'data-grammarly-ignore',
      'data-grammarly-disabled',
      'data-new-gr-c-s-check-loaded',
      'data-gr-ext-installed',
      'cz-shortcut-listen',
      'data-extension-id'
    ];
    
    extensionAttributes.forEach(attr => {
      if (body.hasAttribute(attr)) {
        body.removeAttribute(attr);
      }
    });
  }, []);

  return null;
}
