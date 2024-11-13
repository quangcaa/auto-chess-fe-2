import { create } from 'zustand'

const movesStore = create((set) => ({
    moves: [],
    setMoves: (moves) => set({ moves }),
    addMove: (move) => {
        console.log('Adding move:', move);
        set((state) => ({ moves: [...state.moves, move] }));
    },
    resetMoves: () => set({ moves: [] }),
}))

export default movesStore