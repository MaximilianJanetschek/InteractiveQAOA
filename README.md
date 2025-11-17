# Interactive QAOA Circuit Designer

An interactive web application for building and simulating QAOA (Quantum Approximate Optimization Algorithm) circuits for Max-Cut optimization problems. This tool allows users to visually design quantum circuits by dragging and dropping gates onto qubit lines, configure parameters, and simulate the results using Qiskit.

## Features

- **Visual Circuit Builder**: Drag-and-drop interface for building QAOA circuits
- **Qubit Lines**: Visual representation of quantum qubits with state initialization
- **QAOA Gates**:
  - **X Mixer Gates (RX)**: Apply rotation gates for the mixer Hamiltonian
  - **Cost Gates**: Implement cost Hamiltonian based on Max-Cut graph edges
- **Max-Cut Problem**: Generate random graphs for Max-Cut optimization
- **Parameter Control**: Click gates to adjust rotation parameters (β and γ)
- **Real-time Simulation**: Run quantum circuit simulations using Qiskit
- **Results Visualization**: View measurement results and probability distributions
- **Export Functionality**: Export circuit configurations to JSON files
- **Modern UI**: Clean, responsive design with Qucun design system inspired styling

## Architecture

### Backend (Python + Flask + Qiskit)
- **Flask API** for handling circuit creation and simulation
- **Qiskit** for quantum circuit construction and simulation
- **Qiskit Aer** for high-performance quantum simulation
- RESTful API endpoints for frontend communication

### Frontend (React + TypeScript + Vite)
- **React** with TypeScript for type-safe component development
- **React DnD** for drag-and-drop functionality
- **Tailwind CSS** with custom design system
- **Vite** for fast development and optimized builds

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd InteractiveQAOA
   ```

2. **Set up the backend**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Set up the frontend**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python app.py
   ```
   The backend will run on `http://localhost:5001`

2. **Start the frontend development server** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`

3. **Open your browser** and navigate to `http://localhost:3000`

## Usage Guide

### 1. Generate a Max-Cut Graph
- Set the number of qubits using the input field
- Click "Generate Graph" to create a random Max-Cut problem
- The graph edges will be displayed in the right panel

### 2. Build Your QAOA Circuit
- **Drag gates** from the left toolbox onto the qubit lines
- **X Mixer (RX)**: Creates mixer layer with RX rotations
- **Cost (Max-Cut)**: Creates cost layer with ZZ interactions based on graph edges

### 3. Configure Parameters
- **Click on any gate** to open the parameter editor
- Adjust the rotation angle (β for mixer, γ for cost)
- Default value is π/4 (0.785)

### 4. Run Simulation
- Click "Run Simulation" to execute the circuit on Qiskit's simulator
- Results will appear in the right panel showing:
  - Most probable measurement outcomes
  - Count for each observed state

### 5. Export Circuit
- Click "Export" to download the circuit configuration as JSON
- The file includes all gates, parameters, and graph structure

### 6. Clear Circuit
- Click "Clear" to remove all gates and start over

## API Endpoints

### Health Check
```
GET /api/health
```
Returns the status of the backend server.

### Create Circuit
```
POST /api/circuit/create
Body: { "num_qubits": 4 }
```
Creates a new QAOA circuit with specified number of qubits.

### Build Circuit
```
POST /api/circuit/build
Body: {
  "num_qubits": 4,
  "operations": [
    { "type": "mixer", "qubits": [0, 1, 2, 3], "parameter": 0.785 },
    { "type": "cost", "edges": [[0,1], [1,2]], "parameter": 0.785 }
  ]
}
```
Builds a circuit from a list of operations.

### Simulate Circuit
```
POST /api/circuit/simulate
Body: {
  "num_qubits": 4,
  "operations": [...],
  "shots": 1024
}
```
Simulates the circuit and returns measurement results.

### Generate Max-Cut Graph
```
POST /api/maxcut/graph
Body: { "num_nodes": 4, "edge_probability": 0.5 }
```
Generates a random graph for the Max-Cut problem.

## Technology Stack

### Backend
- **Flask 3.0**: Web framework
- **Qiskit 1.0**: Quantum computing framework
- **Qiskit Aer 0.13**: Quantum simulators
- **NumPy**: Numerical computations
- **Flask-CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: UI framework
- **TypeScript 5**: Type-safe JavaScript
- **Vite 5**: Build tool and dev server
- **React DnD**: Drag-and-drop functionality
- **Tailwind CSS 3**: Utility-first CSS framework
- **Axios**: HTTP client

## QAOA Overview

The Quantum Approximate Optimization Algorithm (QAOA) is a variational quantum algorithm for solving combinatorial optimization problems. This application specifically implements QAOA for the Max-Cut problem.

### QAOA Components

1. **Initial State**: All qubits start in equal superposition (Hadamard gates)
2. **Cost Hamiltonian**: Encodes the Max-Cut problem using ZZ interactions
3. **Mixer Hamiltonian**: Explores the solution space using X rotations
4. **Parameters**: β (mixer) and γ (cost) are tunable parameters

### Circuit Structure
```
|0⟩ ─H─ RX(β) ─ ZZ(γ) ─ RX(β) ─ ... ─ Measure
|0⟩ ─H─ RX(β) ─ ZZ(γ) ─ RX(β) ─ ... ─ Measure
...
```

## Development

### Project Structure
```
InteractiveQAOA/
├── backend/
│   ├── app.py              # Flask application
│   ├── requirements.txt    # Python dependencies
│   └── README.md          # Backend documentation
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── types.ts       # TypeScript types
│   │   ├── api.ts         # API client
│   │   ├── App.tsx        # Main application
│   │   └── main.tsx       # Entry point
│   ├── package.json       # Node dependencies
│   └── vite.config.ts     # Vite configuration
└── README.md              # This file
```

### Building for Production

**Frontend**:
```bash
cd frontend
npm run build
```
The built files will be in `frontend/dist/`

**Backend**:
The backend can be deployed using any WSGI server like Gunicorn:
```bash
pip install gunicorn
gunicorn app:app
```

## Customization

### Adding New Gate Types
1. Add gate type to `frontend/src/types.ts`
2. Create gate component in `GateToolbox.tsx`
3. Implement backend logic in `backend/app.py`

### Modifying Design System
- Edit color variables in `frontend/src/index.css`
- Update Tailwind config in `frontend/tailwind.config.js`

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project for educational or commercial purposes.

## Acknowledgments

- Built with [Qiskit](https://qiskit.org/) - IBM's quantum computing framework
- UI design inspired by [Qucun](https://qucun.de/) design system
- QAOA algorithm based on research by Farhi, Goldstone, and Gutmann

## Support

For questions or issues, please open an issue on the GitHub repository.
