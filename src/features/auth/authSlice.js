import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "auth_user";

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialState = {
  user: loadUser(), 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload || null;
      try {
        if (action.payload) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
        } else {
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        
      }
    },
    logout(state) {
      state.user = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
