# QAOA Backend

Python Flask backend for Interactive QAOA circuit builder.

## Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
python app.py
```

The API will be available at `http://localhost:5001`

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/circuit/create` - Create a new QAOA circuit
- `POST /api/circuit/build` - Build a QAOA circuit from operations
- `POST /api/circuit/simulate` - Simulate a QAOA circuit
- `POST /api/maxcut/graph` - Generate a Max-Cut problem graph
