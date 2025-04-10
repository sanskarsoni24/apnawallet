
# Surakshit Locker Desktop App Development

This guide explains how to set up and develop the Surakshit Locker desktop application using Electron.

## Prerequisites

- Node.js 18+ and npm
- Git

## Setup Development Environment

1. Clone the repository:
   ```bash
   git clone https://github.com/surakshit/surakshit-locker.git
   cd surakshit-locker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the React development server:
   ```bash
   npm start
   ```

4. In a separate terminal, run Electron pointing to the React dev server:
   ```bash
   npm run electron-dev
   ```

## Project Structure

- `public/electron.js` - Main Electron process
- `public/preload.js` - Preload script for secure IPC communication
- `src/utils/desktopIntegration.ts` - Utilities for React to communicate with Electron

## Building for Production

### Build React app:
```bash
npm run build
```

### Package Electron app:
```bash
npm run electron-pack
```

This will create distributables in the `dist` directory.

## Platform-specific builds

- Windows: `npm run electron-pack-win`
- macOS: `npm run electron-pack-mac`
- Linux: `npm run electron-pack-linux`

## Available Electron APIs

The desktop app provides several native features:

- Biometric authentication
- Offline document storage
- Native notifications
- System menu integration
- Automatic updates

## Developer Notes

- All communication between the React app and Electron must go through the IPC system
- The preload script establishes a secure bridge with limited API access
- Native features should gracefully fallback in web environments

## Debugging

- Open Chrome DevTools in development mode with `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)
- Check the Electron main process logs in the terminal where you launched Electron
- For renderer process debugging, use the DevTools console

## Security Considerations

- Always validate data coming from IPC
- Use contextIsolation to prevent prototype pollution
- Don't expose the entire Node.js API to the renderer
- Sanitize all file paths to prevent path traversal attacks
