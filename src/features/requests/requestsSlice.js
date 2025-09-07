// src/features/requests/requestsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  q: "",
  status: "all",
  priority: "all",
  page: 1,
  pageSize: 20,
  sort: { field: "createdAt", dir: "desc" },
};

const slice = createSlice({
  name: "requestsUi",
  initialState,
  reducers: {
    setQuery: (state, action) => { state.q = action.payload; },
    setStatus: (state, action) => { state.status = action.payload; state.page = 1; },
    setPriority: (state, action) => { state.priority = action.payload; state.page = 1; },
    setPage: (state, action) => { state.page = action.payload; },
    setSort: (state, action) => { state.sort = action.payload; state.page = 1; },
    resetFilters: () => initialState,
  },
});

export const { setQuery, setStatus, setPriority, setPage, setSort, resetFilters } = slice.actions;
export default slice.reducer;
