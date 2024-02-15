from flask import Flask, request, jsonify, render_template
from .app import PuzzleSolver

app = Flask(__name__)

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/solve', methods=['POST'])
def solve_puzzle():
    data = request.json
    initial_state = data.get('puzzle')
    solver = PuzzleSolver()
    steps = solver.solve(initial_state)
    next_step = solver.next_step(initial_state)
    context = {
        'steps': steps,
        'next_step': next_step,
    }
    return render_template('index.html', context=context)

if __name__ == '__main__':
    app.run(debug=True)
