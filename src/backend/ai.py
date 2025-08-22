import json
from collections import defaultdict
from typing import List, Tuple

def load_games(file_path: str) -> List[Tuple[List[str], int]]:
    games = []
    with open(file_path, "r") as f:
        for line in f:
            seq, result = json.loads(line)
            games.append((seq, result))
    return games

def build_lookup(games: List[Tuple[List[str], int]]):
    lookup = defaultdict(lambda: defaultdict(lambda: {"win": 0, "draw": 0, "loss": 0}))
    for seq, result in games:
        temp = True # True for player 1, False for player 2
        for turn in range(len(seq)):
            state = tuple(seq[:turn])
            move = seq[turn]
            if temp:
                if result == 1:
                    lookup[state][move]["win"] += 1
                elif result == 0:
                    lookup[state][move]["draw"] += 1
                else:
                    lookup[state][move]["loss"] += 1
            else:
                if result == 1:
                    lookup[state][move]["loss"] += 1
                elif result == 0:
                    lookup[state][move]["draw"] += 1
                else:
                    lookup[state][move]["win"] += 1
            temp = not temp
    return lookup

def get_move_stats(lookup, state: Tuple[str]):
    stats = {}
    if state not in lookup:
        return stats
    for move, counts in lookup[state].items():
        total = counts["win"] + counts["draw"] + counts["loss"]
        if total == 0:
            continue
        stats[move] = {
            "total_games": total,
            "win_rate": round(counts["win"] / total, 3),
            "draw_rate": round(counts["draw"] / total, 3),
            "loss_rate": round(counts["loss"] / total, 3)
        }
    return stats

def pick_best_move_dynamic(lookup, state: Tuple[str]):
    stats = get_move_stats(lookup, state)
    if not stats:
        return None

    moves_played = len(state)
    if moves_played <= 3:
        win_threshold = 0.25
    elif moves_played <= 6:
        win_threshold = 0.20
    else:
        win_threshold = 0.15
        
    best_win_move, best_win_data = max(stats.items(), key=lambda x: x[1]["win_rate"])

    if best_win_data["win_rate"] >= win_threshold:
        return best_win_move

    best_draw_move = max(stats.items(), key=lambda x: x[1]["draw_rate"])[0]
    return best_draw_move
