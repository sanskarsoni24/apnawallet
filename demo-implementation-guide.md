# ApnaWallet Demo Implementation Guide

This technical guide is for developers to prepare the application for recording demo videos. It outlines specific features that should be highlighted and any mock data or special configurations needed.

## Setup Requirements

1. **Demo Environment:**
   - Create a separate demo environment with pre-populated data
   - Configure faster animations for demo purposes
   - Ensure all premium features are enabled regardless of account type

2. **Mock User Accounts:**
   - Create demo accounts with different levels of usage:
     - `new-user@demo.com`: Empty account for onboarding demos
     - `power-user@demo.com`: Account with 50+ documents across multiple categories
     - `enterprise-user@demo.com`: Account with team sharing enabled

3. **Sample Documents:**
   - Prepare a set of non-sensitive sample documents:
     - Passport (with fake data)
     - Driver's license (with fake data)
     - Insurance policy
     - Property deed
     - Medical records
     - Financial statements
   - Ensure some documents have expiration dates set in the near future

## Feature Highlights for Demo Videos

### 1. Security Features

**Vault Unlocking Animation:**
```typescript
// Add a smooth animation to the vault unlocking sequence
// in SurakshaLocker.tsx

const handleUnlock = () => {
  setUnlockAnimation(true);
  setTimeout(() => {
    setIsLocked(false);
    sessionStorage.setItem("vaultUnlocked", "true");
    setUnlockAnimation(false);
    toast({
      title: "Vault unlocked",
      description: "You now have access to your secure vault",
    });
  }, 1200); // Animation duration
};
```

**Encryption Indicators:**
- Add visual cues during document upload showing encryption in progress
- Display a "Encrypted with AES-256" badge on all documents
- Show "end-to-end encrypted" status in document details

### 2. Document Management Demo

**Enhanced Search:**
- Implement highlighted search results
- Add search suggestions
- Show search history

**Drag and Drop:**
- Ensure smooth animations for drag and drop between categories
- Add visual feedback when documents are moved or categorized

**Batch Operations:**
- Enable selection of multiple documents
- Implement batch tagging, categorization, and sharing operations

### 3. Expiry Tracking Demo

**Calendar Enhancements:**
- Add color-coding based on expiry urgency
- Implement timeline view showing documents by expiry date
- Add graphical indicators for expiry status

**Notification Preview:**
- Create a notification preview feature that shows what alerts will look like
- Add ability to test notification delivery without waiting for actual expiry

### 4. User Experience Demo

**Responsive Design Test Mode:**
- Add a development tool that simulates different screen sizes without resizing the browser
- Create smooth transitions between device views

**Theme Switching:**
- Ensure instant theme switching without page reload
- Add subtle animations during theme transitions

**Accessibility Demonstration:**
- Add a demonstration mode that highlights keyboard navigation paths
- Include screen reader compatibility indicators

### 5. Getting Started Demo

**Guided Tour:**
- Implement an interactive guided tour for new users
- Add progress indicators for setup completion

**Sample Document Library:**
- Create a template library of common document types
- Add one-click import of sample documents for demo purposes

## Technical Implementation Notes

### Performance Optimizations for Demo Recording

1. **Preloading:**
```typescript
// Preload assets needed for the demo
useEffect(() => {
  const demoAssets = [
    '/assets/animations/unlock.json',
    '/assets/animations/encrypt.json',
    // Other assets
  ];
  
  demoAssets.forEach(asset => {
    const preloadLink = document.createElement('link');
    preloadLink.href = asset;
    preloadLink.rel = 'preload';
    preloadLink.as = asset.endsWith('.json') ? 'fetch' : 'image';
    document.head.appendChild(preloadLink);
  });
}, []);
```

2. **Disable Throttling:**
```typescript
// For demo purposes, disable API throttling
if (process.env.DEMO_MODE === 'true') {
  disableAPIThrottling();
}
```

3. **Predictable State:**
```typescript
// Ensure consistent demo state
export const resetDemoState = () => {
  localStorage.setItem('demoState', JSON.stringify(initialDemoState));
  window.location.reload();
};
```

### Recording Quality Enhancements

1. **UI Zoom Controls:**
```typescript
// Add zoom controls for demo recording
const [uiZoom, setUiZoom] = useState(1);

// In component JSX:
<div style={{ transform: `scale(${uiZoom})` }}>
  {/* Component content */}
</div>

// Control panel (only visible in demo mode)
{isDemoMode && (
  <div className="demo-controls">
    <button onClick={() => setUiZoom(uiZoom + 0.1)}>Zoom In</button>
    <button onClick={() => setUiZoom(uiZoom - 0.1)}>Zoom Out</button>
    <button onClick={() => setUiZoom(1)}>Reset</button>
  </div>
)}
```

2. **Cursor Highlighting:**
```typescript
// Add cursor highlight for demo recordings
const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
const [showHighlight, setShowHighlight] = useState(false);

useEffect(() => {
  if (isDemoMode) {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    
    const handleClick = () => {
      setShowHighlight(true);
      setTimeout(() => setShowHighlight(false), 800);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }
}, [isDemoMode]);

// In component JSX:
{isDemoMode && showHighlight && (
  <div 
    className="cursor-highlight" 
    style={{ 
      left: cursorPos.x, 
      top: cursorPos.y,
      position: 'fixed',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      backgroundColor: 'rgba(37, 99, 235, 0.3)',
      transform: 'translate(-50%, -50%)',
      pointerEvents: 'none',
      zIndex: 9999,
      animation: 'cursorPulse 0.8s ease-out'
    }} 
  />
)}
```

## Final Checklist Before Recording

1. Clear browser cache and cookies
2. Set browser zoom to 100%
3. Hide all developer extensions and toolbars
4. Enable Do Not Disturb mode on the recording device
5. Test all transitions and animations
6. Verify that all demo accounts are properly configured
7. Run through each demo script with a timer to ensure proper pacing
8. Check audio recording levels if narrating during screen capture
