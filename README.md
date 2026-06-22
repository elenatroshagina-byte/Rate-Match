# Rate Match Settings Prototype

Clickable prototype for the Rate Match settings flow. The UI is built with TL Reactor components, the `global` light theme, and Vite.

## Requirements

- Node.js 20 or newer
- Access to the private npm registry that hosts `@reactor/*` packages

## Setup

1. Add the private Reactor registry credentials to a local `.npmrc`.

2. Install dependencies:

   ```bash
   npm install --cache ./.npm-cache
   ```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

The dev server starts on `http://127.0.0.1:5173/` by default.

## Prototype Flow

- Hotel, language and currency
- Room category matching
- Rate connection
- Rate price settings
- Rate Match activation switch with snackbar feedback

## Notes

- `.npmrc`, `node_modules`, build output, local npm cache, and temporary screenshots are ignored by git.
- Vite aliases point Reactor packages to their installed `dist` entrypoints to keep the prototype build stable.
