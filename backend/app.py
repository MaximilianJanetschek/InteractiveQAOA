from flask import Flask, request, jsonify
from flask_cors import CORS
from qiskit import QuantumCircuit
from qiskit.circuit import Parameter
from qiskit_aer import AerSimulator
from qiskit.quantum_info import SparsePauliOp
import numpy as np

app = Flask(__name__)
CORS(app)

class QAOACircuitBuilder:
    """Build and simulate QAOA circuits for Max-Cut problems"""

    def __init__(self, num_qubits):
        self.num_qubits = num_qubits
        self.circuit = QuantumCircuit(num_qubits)
        self.mixer_layers = []
        self.cost_layers = []

    def add_hadamard_layer(self):
        """Initialize qubits in superposition"""
        for i in range(self.num_qubits):
            self.circuit.h(i)
        return self

    def add_mixer_layer(self, beta, qubits=None):
        """Add X mixer layer to specific qubits or all qubits"""
        if qubits is None:
            qubits = list(range(self.num_qubits))

        for qubit in qubits:
            self.circuit.rx(2 * beta, qubit)

        self.mixer_layers.append({
            'qubits': qubits,
            'parameter': beta
        })
        return self

    def add_cost_layer(self, gamma, edges):
        """Add cost Hamiltonian layer for Max-Cut problem

        For Max-Cut, the cost Hamiltonian is H_C = -Σ_{(i,j)∈E} Z_i Z_j
        We apply U_C(γ) = e^(-i γ H_C) = e^(i γ Σ Z_i Z_j)
        For each edge, this is e^(i γ Z_i Z_j) = RZZ(-2γ)

        Args:
            gamma: Cost parameter
            edges: List of tuples representing edges [(q0, q1), (q1, q2), ...]
        """
        for q0, q1 in edges:
            # Apply RZZ(-2γ) = e^(i γ Z_i Z_j) for Max-Cut
            self.circuit.cx(q0, q1)
            self.circuit.rz(-2 * gamma, q1)  # Negative sign for Max-Cut
            self.circuit.cx(q0, q1)

        self.cost_layers.append({
            'edges': edges,
            'parameter': gamma
        })
        return self

    def add_zz_gate(self, gamma, qubit1, qubit2):
        """Add a single ZZ gate between two qubits

        Uses the same convention as cost layer for Max-Cut: e^(i γ Z_i Z_j)

        Args:
            gamma: Rotation parameter
            qubit1: First qubit index
            qubit2: Second qubit index
        """
        # Apply RZZ(-2γ) = e^(i γ Z_i Z_j) for Max-Cut consistency
        self.circuit.cx(qubit1, qubit2)
        self.circuit.rz(-2 * gamma, qubit2)  # Negative sign for Max-Cut
        self.circuit.cx(qubit1, qubit2)
        return self

    def get_circuit(self):
        """Return the built circuit"""
        return self.circuit

    def get_circuit_info(self):
        """Return circuit information"""
        return {
            'num_qubits': self.num_qubits,
            'depth': self.circuit.depth(),
            'num_gates': len(self.circuit.data),
            'mixer_layers': self.mixer_layers,
            'cost_layers': self.cost_layers
        }

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'QAOA Backend is running'})

@app.route('/api/circuit/create', methods=['POST'])
def create_circuit():
    """Create a new QAOA circuit"""
    data = request.json
    num_qubits = data.get('num_qubits', 4)

    try:
        builder = QAOACircuitBuilder(num_qubits)
        builder.add_hadamard_layer()

        return jsonify({
            'success': True,
            'message': 'Circuit created successfully',
            'circuit_info': builder.get_circuit_info()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/circuit/build', methods=['POST'])
def build_circuit():
    """Build a QAOA circuit from operations"""
    data = request.json
    num_qubits = data.get('num_qubits', 4)
    operations = data.get('operations', [])

    try:
        builder = QAOACircuitBuilder(num_qubits)
        builder.add_hadamard_layer()

        # Process operations
        for op in operations:
            op_type = op.get('type')

            if op_type == 'mixer':
                qubits = op.get('qubits', None)
                beta = op.get('parameter', np.pi / 4)
                builder.add_mixer_layer(beta, qubits)

            elif op_type == 'cost':
                edges = op.get('edges', [])
                gamma = op.get('parameter', np.pi / 4)
                builder.add_cost_layer(gamma, edges)

            elif op_type == 'zz':
                qubits = op.get('qubits', [])
                gamma = op.get('parameter', np.pi / 4)
                if len(qubits) >= 2:
                    builder.add_zz_gate(gamma, qubits[0], qubits[1])

        circuit = builder.get_circuit()

        return jsonify({
            'success': True,
            'circuit_info': builder.get_circuit_info(),
            'qasm': circuit.qasm()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

def calculate_maxcut_objective(bitstring, edges):
    """Calculate the Max-Cut objective value for a given bitstring

    The objective is the number of edges cut, i.e., edges where the two
    vertices are in different partitions.

    Args:
        bitstring: Binary string representing the partition (e.g., "0101")
        edges: List of edges [(q0, q1), ...]

    Returns:
        int: Number of edges cut
    """
    if not edges:
        return 0

    cuts = 0
    for q0, q1 in edges:
        # Check if qubits are in different partitions
        if bitstring[q0] != bitstring[q1]:
            cuts += 1

    return cuts

@app.route('/api/circuit/simulate', methods=['POST'])
def simulate_circuit():
    """Simulate a QAOA circuit and return results"""
    data = request.json
    num_qubits = data.get('num_qubits', 4)
    operations = data.get('operations', [])
    shots = data.get('shots', 1024)

    try:
        builder = QAOACircuitBuilder(num_qubits)
        builder.add_hadamard_layer()

        # Collect all edges from the operations
        all_edges = []

        # Process operations
        for op in operations:
            op_type = op.get('type')

            if op_type == 'mixer':
                qubits = op.get('qubits')
                beta = op.get('parameter', np.pi / 4)
                builder.add_mixer_layer(beta, qubits)

            elif op_type == 'cost':
                edges = op.get('edges', [])
                gamma = op.get('parameter', np.pi / 4)
                builder.add_cost_layer(gamma, edges)
                # Collect edges for objective calculation
                for edge in edges:
                    if edge not in all_edges:
                        all_edges.append(edge)

            elif op_type == 'zz':
                qubits = op.get('qubits', [])
                gamma = op.get('parameter', np.pi / 4)
                if len(qubits) >= 2:
                    builder.add_zz_gate(gamma, qubits[0], qubits[1])
                    # Add manual ZZ gates as edges too
                    edge = [qubits[0], qubits[1]]
                    if edge not in all_edges:
                        all_edges.append(edge)

        circuit = builder.get_circuit()
        circuit.measure_all()

        # Simulate
        simulator = AerSimulator()
        job = simulator.run(circuit, shots=shots)
        result = job.result()
        counts = result.get_counts()

        # Convert counts to serializable format with objective values
        counts_list = []
        for state, count in counts.items():
            # Reverse the bitstring (Qiskit uses little-endian)
            reversed_state = state[::-1]
            objective_value = calculate_maxcut_objective(reversed_state, all_edges)
            counts_list.append({
                'state': state,
                'count': count,
                'objective_value': objective_value
            })

        counts_list.sort(key=lambda x: x['count'], reverse=True)

        return jsonify({
            'success': True,
            'counts': counts_list,
            'circuit_info': builder.get_circuit_info()
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/maxcut/graph', methods=['POST'])
def create_maxcut_graph():
    """Generate a Max-Cut problem graph"""
    data = request.json
    num_nodes = data.get('num_nodes', 4)
    edge_probability = data.get('edge_probability', 0.5)

    try:
        # Generate random graph edges
        edges = []
        for i in range(num_nodes):
            for j in range(i + 1, num_nodes):
                if np.random.random() < edge_probability:
                    edges.append([i, j])

        return jsonify({
            'success': True,
            'num_nodes': num_nodes,
            'edges': edges
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001)
