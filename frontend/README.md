# Interactive QAOA Frontend

React + TypeScript frontend for the Interactive QAOA Circuit Designer.

## Tech Stack

- React 18.2
- TypeScript 5.3
- Vite 5.0
- Tailwind CSS 3.4
- React DnD 16.0
- Axios

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Components

- **App.tsx**: Main application container
- **CircuitCanvas**: Circuit visualization area with qubit lines
- **QubitLine**: Individual qubit line with drag-drop support
- **GateToolbox**: Sidebar with draggable gate components
- **GateComponent**: Individual gate with parameter controls
- **ControlPanel**: Top control bar with actions
- **InfoPanel**: Right sidebar showing circuit information

## Styling

The application uses a custom design system based on Qucun's style guide:
- HSL color variables defined in `src/index.css`
- Tailwind CSS for utility classes
- Custom border radius and typography scales

## API Integration

All API calls are centralized in `src/api.ts` and use Axios. The Vite dev server proxies `/api` requests to `http://localhost:5001`.
