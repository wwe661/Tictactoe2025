from fastapi import FastAPI
from pydantic import BaseModel
from ai import load_games, build_lookup, pick_best_move_dynamic, get_move_stats
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, be specific
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Load dataset & build lookup table at startup
FILE_PATH = "tic_tac_toe_results.jsonl"
games = load_games(FILE_PATH)
lookup_table = build_lookup(games)



# Data model for incoming request
class GameState(BaseModel):
    state: list  # list of moves played so far

@app.get("/status")
def get_status():
    return {"message": "FastAPI is running!"}

@app.post("/next-move")
def next_move(data: GameState):
    state_tuple = tuple(data.state)
    best_move = pick_best_move_dynamic(lookup_table, state_tuple)
    stats = get_move_stats(lookup_table, state_tuple)
    return {"best_move": best_move, "stats": stats}
