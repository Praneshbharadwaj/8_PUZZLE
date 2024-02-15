import heapq
import random

class PuzzleSolver:

    def solve(self, puzzle):
        goal_state = [[1, 2, 3], [4, 5, 6], [7, 8, 0]] # goal state
        open_list = []
        closed_list = set()
        heapq.heappush(open_list, (self.heuristic(puzzle), 0, puzzle)) # (heuristic value, g(n), state)

        while open_list:
            _, cost, current_state = heapq.heappop(open_list)
            if current_state == goal_state:
                return cost

            if tuple(map(tuple, current_state)) not in closed_list:
                closed_list.add(tuple(map(tuple, current_state)))
                zero_row, zero_col = self.find_zero(current_state)

                # Generate possible moves
                for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
                    new_row, new_col = zero_row + dr, zero_col + dc
                    if 0 <= new_row < 3 and 0 <= new_col < 3:
                        new_state = [row[:] for row in current_state]
                        new_state[zero_row][zero_col], new_state[new_row][new_col] = new_state[new_row][new_col], new_state[zero_row][zero_col]
                        heapq.heappush(open_list, (cost + 1 + self.heuristic(new_state), cost + 1, new_state))

        return -1 # No solution found

    def heuristic(self, state):
        # Manhattan distance heuristic
        distance = 0
        for i in range(3):
            for j in range(3):
                if state[i][j] != 0:
                    current_row, current_col = divmod(state[i][j] - 1, 3)
                    distance += abs(i - current_row) + abs(j - current_col)
        return distance

    def find_zero(self, state):
        for i in range(3):
            for j in range(3):
                if state[i][j] == 0:
                    return i, j
                
    def next_step(self, puzzle):
        zero_row, zero_col = self.find_zero(puzzle)
        possible_moves = [(0, 1, 'R'), (0, -1, 'L'), (1, 0, 'D'), (-1, 0, 'U')]
        min_cost = float('inf')
        best_move = ''

        for dr, dc, move in possible_moves:
            new_row, new_col = zero_row + dr, zero_col + dc
            if 0 <= new_row < 3 and 0 <= new_col < 3:
                new_state = [row[:] for row in puzzle]
                new_state[zero_row][zero_col], new_state[new_row][new_col] = new_state[new_row][new_col], new_state[zero_row][zero_col]
                cost = self.solve(new_state)
                if cost < min_cost:
                    min_cost = cost
                    best_move = move

        return best_move
    
    def shuffle_puzzle(self):
        goal_state = [[1, 2, 3], [4, 5, 6], [7, 8, 0]]
        possible_moves = [(0, 1, 'R'), (0, -1, 'L'), (1, 0, 'D'), (-1, 0, 'U')]

        for _ in range(1000):
            zero_row, zero_col = self.find_zero(goal_state)
            rand = random.randint(0, 3)
            new_row, new_col, move = possible_moves[rand]
            new_row, new_col = zero_row + new_row, zero_col + new_col
            if 0 <= new_row < 3 and 0 <= new_col < 3:
                goal_state[zero_row][zero_col], goal_state[new_row][new_col] = goal_state[new_row][new_col], goal_state[zero_row][zero_col]
        return goal_state
