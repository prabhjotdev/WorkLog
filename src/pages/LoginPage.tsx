import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAuth } from '@/hooks/useAuth';
import { signIn, signUp } from '@/store/authSlice';
import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = signInSchema.extend({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type SignInFields = z.infer<typeof signInSchema>;
type SignUpFields = z.infer<typeof signUpSchema>;

export default function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const signInForm = useForm<SignInFields>({ resolver: zodResolver(signInSchema) });
  const signUpForm = useForm<SignUpFields>({ resolver: zodResolver(signUpSchema) });

  const loading = status === 'loading';

  async function handleSignIn(values: SignInFields) {
    const result = await dispatch(signIn(values));
    if (signIn.fulfilled.match(result)) {
      navigate('/', { replace: true });
    } else {
      toast.error(result.error.message ?? 'Sign in failed');
    }
  }

  async function handleSignUp(values: SignUpFields) {
    const result = await dispatch(signUp(values));
    if (signUp.fulfilled.match(result)) {
      toast.success('Account created! Check your email to confirm.');
      setMode('signin');
    } else {
      toast.error(result.error.message ?? 'Sign up failed');
    }
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
            <svg
              className="h-7 w-7 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">WorkLog</h1>
          <p className="mt-1 text-sm text-slate-500">Track your work. Prove your impact.</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-slate-900">
            {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
          </h2>

          {mode === 'signin' ? (
            <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="flex flex-col gap-4">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={signInForm.formState.errors.email?.message}
                {...signInForm.register('email')}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                error={signInForm.formState.errors.password?.message}
                {...signInForm.register('password')}
              />
              <Button type="submit" loading={loading} className="mt-2 w-full">
                Sign in
              </Button>
            </form>
          ) : (
            <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="flex flex-col gap-4">
              <Input
                label="Display name"
                type="text"
                autoComplete="name"
                placeholder="Jane Smith"
                error={signUpForm.formState.errors.displayName?.message}
                {...signUpForm.register('displayName')}
              />
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                error={signUpForm.formState.errors.email?.message}
                {...signUpForm.register('email')}
              />
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                hint="At least 6 characters"
                error={signUpForm.formState.errors.password?.message}
                {...signUpForm.register('password')}
              />
              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                error={signUpForm.formState.errors.confirmPassword?.message}
                {...signUpForm.register('confirmPassword')}
              />
              <Button type="submit" loading={loading} className="mt-2 w-full">
                Create account
              </Button>
            </form>
          )}

          <p className="mt-5 text-center text-sm text-slate-500">
            {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
              className="font-medium text-brand-600 hover:text-brand-700"
            >
              {mode === 'signin' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
