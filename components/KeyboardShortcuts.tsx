'use client';

import { useEffect } from 'react';

export default function KeyboardShortcuts() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when user is typing in an input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }

      // Don't trigger if modifier keys are pressed (except for specific shortcuts)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      const sections = [
        { key: '1', id: 'about' },
        { key: '2', id: 'divisions' },
        { key: '3', id: 'team' },
        { key: '4', id: 'projects' },
        { key: '5', id: 'form' },
        { key: '6', id: 'contact' },
      ];

      // Number keys for sections
      const section = sections.find((s) => s.key === e.key);
      if (section) {
        e.preventDefault();
        const element = document.getElementById(section.id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }

      // 'H' for home/hero
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return null; // This component doesn't render anything
}

