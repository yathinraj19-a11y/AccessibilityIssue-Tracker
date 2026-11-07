import React from 'react';
import { useIssues } from '../context/IssueContext';

/**
 * Accessible ARIA Live Region component for announcing dynamic board events
 * (status changes, new findings, verifications) to screen readers.
 * Meets WCAG 4.1.3 Status Messages (Level AA).
 */
export default function AccessibilityAnnouncer() {
  const { announcement } = useIssues();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
}

