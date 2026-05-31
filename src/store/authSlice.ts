import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Session } from '@supabase/supabase-js';
import type { Profile } from '@/types/app';
import * as authService from '@/services/auth.service';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

const initialState: AuthState = {
  session: null,
  profile: null,
  status: 'idle',
  error: null,
};

export const signIn = createAsyncThunk(
  'auth/signIn',
  async ({ email, password }: { email: string; password: string }) => {
    return authService.signIn(email, password);
  }
);

export const signUp = createAsyncThunk(
  'auth/signUp',
  async ({
    email,
    password,
    displayName,
  }: {
    email: string;
    password: string;
    displayName: string;
  }) => {
    return authService.signUp(email, password, displayName);
  }
);

export const signOut = createAsyncThunk('auth/signOut', async () => {
  await authService.signOut();
});

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (userId: string) => {
    return authService.getProfile(userId);
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async ({ userId, data }: { userId: string; data: { display_name?: string; role?: string } }) => {
    return authService.updateProfile(userId, data);
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSession(state, action: PayloadAction<Session | null>) {
      state.session = action.payload;
    },
    setProfile(state, action: PayloadAction<Profile | null>) {
      state.profile = action.payload;
    },
    clearAuth(state) {
      state.session = null;
      state.profile = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // signIn
    builder
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'idle';
        state.session = action.payload.session;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Sign in failed';
      });

    // signUp
    builder
      .addCase(signUp.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.status = 'idle';
        state.session = action.payload.session;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.error.message ?? 'Sign up failed';
      });

    // signOut
    builder.addCase(signOut.fulfilled, (state) => {
      state.session = null;
      state.profile = null;
      state.status = 'idle';
    });

    // fetchProfile
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (_state, action) => {
        console.error('Failed to fetch profile:', action.error.message);
      });

    // updateProfile
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.profile = action.payload;
    });
  },
});

export const { setSession, setProfile, clearAuth } = authSlice.actions;
export default authSlice.reducer;
