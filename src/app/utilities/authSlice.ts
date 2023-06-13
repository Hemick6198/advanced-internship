import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAuth, getIdTokenResult, onAuthStateChanged } from "firebase/auth";

interface CustomUser {
  uid: string | null;
  email: string | null;
  subscriptionPlan: any;
}

interface AuthState {
  user: CustomUser | null;
  isUserAuth: boolean;
}

const initialState: AuthState = {
  user: null,
  isUserAuth: false,
};

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch }) => {
    const auth = getAuth();
    return new Promise<void>((resolve) => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          await user.getIdToken(true);
          const decodedToken = await getIdTokenResult(user);

          const userObj: CustomUser = {
            uid: user.uid,
            email: user.email,
            subscriptionPlan: decodedToken.claims.stripeRole,
          };

          dispatch(setUser(userObj));
          dispatch(setIsUserAuth(true));
        } else {
          dispatch(setUser(null));
          dispatch(setIsUserAuth(false));
        }

        resolve();
      });
    });
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsUserAuth: (state, action: PayloadAction<boolean>) => {
      state.isUserAuth = action.payload;
    },
    setUser: (state, action: PayloadAction<CustomUser | null>) => {
      state.user = action.payload;
    },
  },
});

export const { setIsUserAuth, setUser } = authSlice.actions;
export default authSlice.reducer;
