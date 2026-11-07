const sampleAudits = {
  ecommerce: {
    id: 'ecommerce',
    name: 'RetailCore E-Commerce Checkout & Product Pages',
    target: 'https://shop.retailcore-demo.com',
    standard: 'WCAG 2.1 Level AA',
    auditor: 'Senior Accessibility Specialist (CPACC)',
    findingsCount: 8,
    issues: [
      {
        issueId: 'A11Y-101',
        title: 'Primary "Place Order" button missing accessible name',
        description: 'The final submit order button relies purely on an SVG cart icon without inner text, aria-label, or title, causing screen readers to announce "unlabelled button".',
        wcagCriterion: '4.1.2 Name, Role, Value',
        wcagLevel: 'A',
        severity: 'critical',
        impact: 'Screen reader users cannot identify or reliably trigger the order completion action.',
        targetUrl: '/checkout/payment',
        selector: 'button.checkout-submit-btn',
        htmlSnippet: '<button class="checkout-submit-btn" id="pay-submit"><svg class="icon-cart">...</svg></button>',
        source: 'sample-audit',
        status: 'in_progress',
        assignedTo: {
          name: 'Sarah Chen',
          email: 'sarah.chen@engineering.local',
          role: 'Frontend Engineer'
        },
        remediation: {
          suggestedFix: 'Add aria-label="Place your order" and accessible visually hidden text inside the button element.',
          fixSnippet: '<button class="checkout-submit-btn" id="pay-submit" aria-label="Place Order - Total $84.50"><span class="sr-only">Place Order</span><svg aria-hidden="true" class="icon-cart">...</svg></button>',
          fixedBy: 'Sarah Chen',
          pullRequestUrl: 'https://github.com/retailcore/web/pull/482'
        },
        verification: {
          status: 'unverified',
          assistiveTechUsed: [],
          evidenceNotes: 'Pending QA verification with NVDA 2024.1 on Chrome.',
          codeDiffConfirmed: false,
          screenReaderTested: false,
          keyboardTested: false
        },
        tags: ['checkout', 'button', 'screen-reader', 'aria']
      },
      {
        issueId: 'A11Y-102',
        title: 'Insufficient contrast on discount promo banner text',
        description: 'Subtle gray text #8C8C8C on light gray background #F3F4F6 has a contrast ratio of 2.92:1, failing the 4.5:1 minimum threshold for standard text.',
        wcagCriterion: '1.4.3 Contrast (Minimum)',
        wcagLevel: 'AA',
        severity: 'serious',
        impact: 'Users with low vision or viewing screens in bright daylight cannot read coupon codes and discount expiration details.',
        targetUrl: '/cart',
        selector: '.promo-callout p.disclaimer',
        htmlSnippet: '<p class="disclaimer" style="color: #8C8C8C; background: #F3F4F6;">Offer ends midnight PST. Exclusions apply.</p>',
        source: 'axe-core',
        status: 'ready_for_review',
        assignedTo: {
          name: 'Alex Rivera',
          email: 'alex.rivera@design.local',
          role: 'UI/UX Designer'
        },
        remediation: {
          suggestedFix: 'Darken text color to #4B5563 or #1F2937, providing at least 5.8:1 contrast against #F3F4F6.',
          fixSnippet: '<p class="disclaimer text-gray-700 bg-gray-100 dark:text-gray-200 dark:bg-gray-800">Offer ends midnight PST. Exclusions apply.</p>',
          fixedBy: 'Alex Rivera',
          pullRequestUrl: 'https://github.com/retailcore/web/pull/489'
        },
        verification: {
          status: 'passed',
          verifiedBy: 'Morgan Davis (QA A11y Lead)',
          verifiedAt: new Date(Date.now() - 86400000 * 2),
          assistiveTechUsed: ['Color Contrast Analyzer', 'axe DevTools'],
          evidenceNotes: 'Tested with CCA v3.3. Contrast ratio confirmed at 7.1:1 on #1F2937 / #F3F4F6. Both light and dark modes verified.',
          evidenceImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
          codeDiffConfirmed: true,
          screenReaderTested: false,
          keyboardTested: true
        },
        tags: ['contrast', 'cart', 'design-system']
      },
      {
        issueId: 'A11Y-103',
        title: 'Keyboard focus trap missing inside product quick-view modal',
        description: 'When the modal dialogue opens, focus remains in the background DOM, and keyboard users can tab behind the modal into background navigation links.',
        wcagCriterion: '2.4.3 Focus Order',
        wcagLevel: 'A',
        severity: 'critical',
        impact: 'Keyboard-only navigators and switch-control users get disoriented and cannot easily close or interact with modal controls.',
        targetUrl: '/products/category-electronics',
        selector: 'div.quick-view-modal',
        htmlSnippet: '<div class="quick-view-modal"><div class="modal-body">...</div></div>',
        source: 'sample-audit',
        status: 'verified',
        assignedTo: {
          name: 'Priya Patel',
          email: 'priya.patel@engineering.local',
          role: 'Frontend Engineer'
        },
        remediation: {
          suggestedFix: 'Implement focus trap using inert on background containers or React FocusLock, trap focus within modal, and return focus to trigger on close.',
          fixSnippet: '<dialog aria-modal="true" role="dialog" aria-labelledby="modal-title" ref={dialogRef} onKeyDown={handleKeyDown}>...</dialog>',
          fixedBy: 'Priya Patel',
          pullRequestUrl: 'https://github.com/retailcore/web/pull/470'
        },
        verification: {
          status: 'passed',
          verifiedBy: 'Morgan Davis (QA A11y Lead)',
          verifiedAt: new Date(Date.now() - 86400000 * 4),
          assistiveTechUsed: ['Keyboard Only', 'VoiceOver (macOS)', 'NVDA'],
          evidenceNotes: 'Verified modal traps Tab and Shift+Tab cycles. Esc key closes dialog smoothly. Focus restores directly to "Quick View" trigger button.',
          evidenceImageUrl: '',
          codeDiffConfirmed: true,
          screenReaderTested: true,
          keyboardTested: true
        },
        tags: ['modal', 'focus-trap', 'keyboard', 'dialog']
      },
      {
        issueId: 'A11Y-104',
        title: 'Missing alternative text on product swatch thumbnail previews',
        description: 'Image tags render color swatch images without alt attribute or with filename like alt="swatch_blue_v2_thumb.jpg".',
        wcagCriterion: '1.1.1 Non-text Content',
        wcagLevel: 'A',
        severity: 'moderate',
        impact: 'Non-sighted shoppers cannot determine which color options are available for the garment.',
        targetUrl: '/products/cotton-crewneck',
        selector: '.swatches-container img.swatch-item',
        htmlSnippet: '<img class="swatch-item" src="/images/swatch_blue_v2_thumb.jpg">',
        source: 'lighthouse',
        status: 'todo',
        assignedTo: {
          name: 'Sarah Chen',
          email: 'sarah.chen@engineering.local',
          role: 'Frontend Engineer'
        },
        remediation: {
          suggestedFix: 'Provide concise descriptive alt text like alt="Navy Blue color option", or use button with aria-label="Select Navy Blue".',
          fixSnippet: '<img class="swatch-item" alt="Navy Blue" src="/images/swatches/navy.png" />',
          fixedBy: '',
          pullRequestUrl: ''
        },
        verification: {
          status: 'unverified',
          assistiveTechUsed: [],
          evidenceNotes: 'Awaiting sprint 24 PR.',
          codeDiffConfirmed: false,
          screenReaderTested: false,
          keyboardTested: false
        },
        tags: ['images', 'alt-text', 'product-detail']
      },
      {
        issueId: 'A11Y-105',
        title: 'Filter accordion triggers lack aria-expanded state and keyboard toggle',
        description: 'Sidebar filters use custom div click listeners without Enter/Space key support and without announcing collapsed/expanded states to screen readers.',
        wcagCriterion: '4.1.2 Name, Role, Value',
        wcagLevel: 'A',
        severity: 'serious',
        impact: 'Keyboard users cannot expand filters, and screen reader users cannot tell if filter menus are open or closed.',
        targetUrl: '/search?q=shoes',
        selector: 'div.filter-group-header',
        htmlSnippet: '<div class="filter-group-header" onclick="toggleFilter(\'brand\')"><span>Brand</span><i class="caret"></i></div>',
        source: 'sample-audit',
        status: 'backlog',
        assignedTo: {
          name: 'David Kim',
          email: 'david.kim@engineering.local',
          role: 'Fullstack Dev'
        },
        remediation: {
          suggestedFix: 'Use native <button type="button" aria-expanded="false" aria-controls="filter-brand-panel"> with keydown listeners.',
          fixSnippet: '<button type="button" aria-expanded={isOpen} aria-controls="filter-brand" onClick={toggle} className="w-full text-left flex justify-between">...</button>',
          fixedBy: '',
          pullRequestUrl: ''
        },
        verification: {
          status: 'unverified',
          assistiveTechUsed: [],
          evidenceNotes: '',
          codeDiffConfirmed: false,
          screenReaderTested: false,
          keyboardTested: false
        },
        tags: ['accordion', 'aria-expanded', 'keyboard', 'navigation']
      },
      {
        issueId: 'A11Y-106',
        title: 'Focus outline suppressed with outline: none without alternative focus styling',
        description: 'Global CSS has * { outline: none; } which removes native focus rings on form inputs, pagination links, and tab controls.',
        wcagCriterion: '2.4.7 Focus Visible',
        wcagLevel: 'AA',
        severity: 'critical',
        impact: 'Sighted keyboard users cannot locate their position on the page while tabbing.',
        targetUrl: '/checkout/shipping',
        selector: 'input.shipping-address-input:focus',
        htmlSnippet: 'input:focus { outline: none; }',
        source: 'pa11y',
        status: 'ready_for_review',
        assignedTo: {
          name: 'Alex Rivera',
          email: 'alex.rivera@design.local',
          role: 'UI/UX Designer'
        },
        remediation: {
          suggestedFix: 'Replace global outline:none with consistent 2px solid #2563EB outline with 2px offset on all interactive states.',
          fixSnippet: ':focus-visible { outline: 2px solid #2563EB; outline-offset: 2px; }',
          fixedBy: 'Alex Rivera',
          pullRequestUrl: 'https://github.com/retailcore/web/pull/494'
        },
        verification: {
          status: 'needs_retest',
          verifiedBy: 'Morgan Davis',
          verifiedAt: new Date(Date.now() - 3600000 * 12),
          assistiveTechUsed: ['Keyboard Only'],
          evidenceNotes: 'Tested Chrome and Edge. Focus ring appears on inputs, but dark mode contrast on dark backgrounds falls below 3:1. Needs higher contrast in dark mode.',
          codeDiffConfirmed: true,
          screenReaderTested: false,
          keyboardTested: true
        },
        tags: ['focus-visible', 'keyboard', 'global-css']
      },
      {
        issueId: 'A11Y-107',
        title: 'Form error messages not linked via aria-describedby or aria-invalid',
        description: 'When credit card validation fails, red error text is injected into the DOM, but screen reader remains focused on input with no announcement of error text.',
        wcagCriterion: '3.3.1 Error Identification',
        wcagLevel: 'A',
        severity: 'serious',
        impact: 'Blind users submitting invalid credit card numbers are left wondering why checkout will not proceed.',
        targetUrl: '/checkout/payment',
        selector: 'input#cc-number',
        htmlSnippet: '<input id="cc-number" type="text" /><span class="error-msg">Invalid card number format</span>',
        source: 'manual',
        status: 'todo',
        assignedTo: {
          name: 'Sarah Chen',
          email: 'sarah.chen@engineering.local',
          role: 'Frontend Engineer'
        },
        remediation: {
          suggestedFix: 'Add aria-invalid="true" to the input and point aria-describedby to the error message ID.',
          fixSnippet: '<input id="cc-number" aria-invalid="true" aria-describedby="cc-error" /><span id="cc-error" role="alert" class="error-msg">Invalid card number format</span>',
          fixedBy: '',
          pullRequestUrl: ''
        },
        verification: {
          status: 'unverified',
          assistiveTechUsed: [],
          evidenceNotes: '',
          codeDiffConfirmed: false,
          screenReaderTested: false,
          keyboardTested: false
        },
        tags: ['forms', 'validation', 'error-handling', 'aria']
      },
      {
        issueId: 'A11Y-108',
        title: 'Carousel autoplay controls missing pause/stop mechanism',
        description: 'Homepage promotional carousel rotates slides every 3 seconds automatically with no visible pause button and no pause on hover or focus.',
        wcagCriterion: '2.2.2 Pause, Stop, Hide',
        wcagLevel: 'A',
        severity: 'moderate',
        impact: 'Users with attention disorders, cognitive impairments, or low vision are distracted and unable to read content before it changes.',
        targetUrl: '/',
        selector: '.home-hero-carousel',
        htmlSnippet: '<div class="home-hero-carousel" data-autoplay="true" data-interval="3000">...</div>',
        source: 'sample-audit',
        status: 'wont_fix',
        assignedTo: {
          name: 'David Kim',
          email: 'david.kim@engineering.local',
          role: 'Fullstack Dev'
        },
        remediation: {
          suggestedFix: 'Add persistent pause/play button and automatically pause carousel when user hovers or tabs into the component.',
          fixSnippet: '<button type="button" aria-label={isPlaying ? "Pause banner carousel" : "Play banner carousel"}>...</button>',
          fixedBy: '',
          pullRequestUrl: ''
        },
        verification: {
          status: 'unverified',
          assistiveTechUsed: [],
          evidenceNotes: 'Product marketing requested temporary risk acceptance until v2 homepage overhaul in Q3.',
          codeDiffConfirmed: false,
          screenReaderTested: false,
          keyboardTested: false
        },
        tags: ['carousel', 'animation', 'wcag-2.2.2']
      }
    ]
  },
  saas: {
    id: 'saas',
    name: 'CloudPulse Analytics SaaS Portal Audit',
    target: 'https://app.cloudpulse-demo.io',
    standard: 'WCAG 2.1 Level AA / Section 508',
    auditor: 'Enterprise A11y Compliance Team',
    findingsCount: 6,
    issues: [
      {
        issueId: 'A11Y-201',
        title: 'Data visualization chart tables missing alternative data representation',
        description: 'Canvas-rendered CPU metric graphs have no accessible data table or text description for screen reader users.',
        wcagCriterion: '1.1.1 Non-text Content',
        wcagLevel: 'A',
        severity: 'critical',
        impact: 'Blind system administrators cannot review server load history and anomalies.',
        targetUrl: '/metrics/system-health',
        selector: 'canvas#cpu-usage-chart',
        htmlSnippet: '<canvas id="cpu-usage-chart" width="800" height="400"></canvas>',
        source: 'manual',
        status: 'in_progress',
        assignedTo: {
          name: 'Marcus Vance',
          email: 'marcus.v@cloudpulse.io',
          role: 'Frontend Engineer'
        },
        remediation: {
          suggestedFix: 'Provide a toggleable accessible HTML <table> or summary metrics alongside the Canvas chart with aria-live updates.',
          fixSnippet: '<figure role="group" aria-label="CPU Usage past 24 hours"><canvas aria-hidden="true" /><details><summary>View tabular data</summary><table>...</table></details></figure>',
          fixedBy: 'Marcus Vance',
          pullRequestUrl: 'https://github.com/cloudpulse/analytics/pull/312'
        },
        verification: {
          status: 'unverified',
          assistiveTechUsed: ['NVDA', 'JAWS'],
          evidenceNotes: 'Table toggle component implemented, awaiting design review for default summary text.',
          codeDiffConfirmed: true,
          screenReaderTested: false,
          keyboardTested: false
        },
        tags: ['charts', 'data-viz', 'canvas', 'screen-reader']
      },
      {
        issueId: 'A11Y-202',
        title: 'Table headers missing scope attribute and column sorting indicator',
        description: 'Sortable metrics table uses plain <th> tags without scope="col" and without aria-sort="ascending/descending" indicators.',
        wcagCriterion: '1.3.1 Info and Relationships',
        wcagLevel: 'A',
        severity: 'moderate',
        impact: 'Screen readers do not associate data cells with column names and cannot announce table sort state.',
        targetUrl: '/logs/audit-trail',
        selector: 'table.data-grid thead th',
        htmlSnippet: '<th>Timestamp</th><th onclick="sortBy(\'severity\')">Severity</th>',
        source: 'axe-core',
        status: 'verified',
        assignedTo: {
          name: 'Sarah Chen',
          email: 'sarah.chen@engineering.local',
          role: 'Frontend Engineer'
        },
        remediation: {
          suggestedFix: 'Add scope="col" and aria-sort="ascending" | "descending" with interactive <button> inside header.',
          fixSnippet: '<th scope="col" aria-sort={sortDirection}><button onClick={handleSort}>Severity <span aria-hidden="true">{icon}</span></button></th>',
          fixedBy: 'Sarah Chen',
          pullRequestUrl: 'https://github.com/cloudpulse/analytics/pull/299'
        },
        verification: {
          status: 'passed',
          verifiedBy: 'Morgan Davis',
          verifiedAt: new Date(Date.now() - 86400000 * 3),
          assistiveTechUsed: ['NVDA', 'VoiceOver (iOS)', 'axe DevTools'],
          evidenceNotes: 'Tested with NVDA in virtual buffer mode. Column headers correctly announced with sorted state and cell associations.',
          evidenceImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
          codeDiffConfirmed: true,
          screenReaderTested: true,
          keyboardTested: true
        },
        tags: ['tables', 'aria-sort', 'semantics']
      },
      {
        issueId: 'A11Y-203',
        title: 'Main navigation lacks "Skip to main content" bypass block link',
        description: 'Top navigation bar contains 24 interactive links and submenus with no skip link, forcing keyboard users to tab through 24 items on every page transition.',
        wcagCriterion: '2.4.1 Bypass Blocks',
        wcagLevel: 'A',
        severity: 'serious',
        impact: 'Severe repetitive strain and navigation fatigue for keyboard and switch device users.',
        targetUrl: '/*',
        selector: 'body > header',
        htmlSnippet: '<header class="top-nav"><nav>24 links...</nav></header>',
        source: 'lighthouse',
        status: 'verified',
        assignedTo: {
          name: 'Alex Rivera',
          email: 'alex.rivera@design.local',
          role: 'UI/UX Designer'
        },
        remediation: {
          suggestedFix: 'Implement an accessible skip link as the very first DOM element that becomes visible on focus and jumps directly to <main id="main-content">.',
          fixSnippet: '<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-blue-600 focus:text-white focus:z-50">Skip to main content</a>',
          fixedBy: 'Alex Rivera',
          pullRequestUrl: 'https://github.com/cloudpulse/analytics/pull/305'
        },
        verification: {
          status: 'passed',
          verifiedBy: 'Morgan Davis',
          verifiedAt: new Date(Date.now() - 86400000 * 5),
          assistiveTechUsed: ['Keyboard Only', 'JAWS 2024'],
          evidenceNotes: 'First tab stroke focuses skip link. Pressing Enter navigates smoothly to #main-content. Verified across Chrome, Firefox, and Safari.',
          codeDiffConfirmed: true,
          screenReaderTested: true,
          keyboardTested: true
        },
        tags: ['skip-link', 'bypass-blocks', 'keyboard']
      },
      {
        issueId: 'A11Y-204',
        title: 'Notification toasts dismiss automatically without screen reader announcement',
        description: 'Real-time alert toasts appear in the bottom right corner and vanish after 4 seconds without aria-live or role="status".',
        wcagCriterion: '4.1.3 Status Messages',
        wcagLevel: 'AA',
        severity: 'serious',
        impact: 'Screen reader users miss crucial system feedback such as "Backup failed" or "Deployment succeeded".',
        targetUrl: '/deployments',
        selector: 'div.toast-container',
        htmlSnippet: '<div class="toast-container"><div class="toast-item">Deployment deployed successfully</div></div>',
        source: 'manual',
        status: 'todo',
        assignedTo: {
          name: 'David Kim',
          email: 'david.kim@engineering.local',
          role: 'Fullstack Dev'
        },
        remediation: {
          suggestedFix: 'Wrap toast container with aria-live="polite" and aria-atomic="true", or use role="status". Ensure user can pause or dismiss.',
          fixSnippet: '<div role="status" aria-live="polite" aria-atomic="true" class="toast-container">...</div>',
          fixedBy: '',
          pullRequestUrl: ''
        },
        verification: {
          status: 'unverified',
          assistiveTechUsed: [],
          evidenceNotes: '',
          codeDiffConfirmed: false,
          screenReaderTested: false,
          keyboardTested: false
        },
        tags: ['notifications', 'aria-live', 'status-messages']
      },
      {
        issueId: 'A11Y-205',
        title: 'Custom dropdown combobox lacks required ARIA 1.2 attributes',
        description: 'Server region picker uses custom div elements without role="combobox", aria-controls, aria-haspopup, or active-descendant management.',
        wcagCriterion: '4.1.2 Name, Role, Value',
        wcagLevel: 'A',
        severity: 'critical',
        impact: 'Assistive tech perceives the widget as static text; impossible to select cloud cluster region.',
        targetUrl: '/clusters/new',
        selector: 'div.custom-region-select',
        htmlSnippet: '<div class="custom-region-select"><div class="selected">us-east-1</div><div class="options">...</div></div>',
        source: 'sample-audit',
        status: 'backlog',
        assignedTo: {
          name: 'Marcus Vance',
          email: 'marcus.v@cloudpulse.io',
          role: 'Frontend Engineer'
        },
        remediation: {
          suggestedFix: 'Replace custom divs with native HTML <select> or follow W3C APG Combobox pattern with keyboard arrow key support.',
          fixSnippet: '<div role="combobox" aria-expanded={isOpen} aria-haspopup="listbox" aria-controls="region-list">...</div>',
          fixedBy: '',
          pullRequestUrl: ''
        },
        verification: {
          status: 'unverified',
          assistiveTechUsed: [],
          evidenceNotes: '',
          codeDiffConfirmed: false,
          screenReaderTested: false,
          keyboardTested: false
        },
        tags: ['combobox', 'dropdown', 'aria-1.2', 'keyboard']
      },
      {
        issueId: 'A11Y-206',
        title: 'Form fields use placeholder as only visible label',
        description: 'Login and API key regeneration inputs have no persistent <label> or aria-labelledby; text vanishes once user begins typing.',
        wcagCriterion: '3.3.2 Labels or Instructions',
        wcagLevel: 'A',
        severity: 'moderate',
        impact: 'Users with memory loss or cognitive challenges lose context of what information is requested once typing begins.',
        targetUrl: '/settings/api-keys',
        selector: 'input#api-key-name',
        htmlSnippet: '<input id="api-key-name" placeholder="Enter key description" />',
        source: 'axe-core',
        status: 'ready_for_review',
        assignedTo: {
          name: 'Priya Patel',
          email: 'priya.patel@engineering.local',
          role: 'Frontend Engineer'
        },
        remediation: {
          suggestedFix: 'Add explicit <label for="api-key-name">Key Description</label> above the input field.',
          fixSnippet: '<label htmlFor="api-key-name" className="block text-sm font-medium mb-1">Key Description</label><input id="api-key-name" ... />',
          fixedBy: 'Priya Patel',
          pullRequestUrl: 'https://github.com/cloudpulse/analytics/pull/318'
        },
        verification: {
          status: 'unverified',
          assistiveTechUsed: [],
          evidenceNotes: 'Ready for accessibility retest on staging environment.',
          codeDiffConfirmed: true,
          screenReaderTested: false,
          keyboardTested: false
        },
        tags: ['forms', 'labels', 'wcag-3.3.2']
      }
    ]
  }
};

module.exports = { sampleAudits };

