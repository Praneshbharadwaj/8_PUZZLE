from flask import Flask, request, jsonify, render_template
from puzzzle_solver import PuzzleSolver

app = Flask(__name__)

@app.route('/home')
def home():
    return render_template('index.html')

@app.route('/shuffle')
def shuffle():
    solver = PuzzleSolver()
    shuffled_array = solver.shuffle_puzzle()
    return jsonify(shuffled_array)

if __name__ == '__main__':
    app.run(debug=True)
