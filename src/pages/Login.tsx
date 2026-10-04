import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { emailSchema, passwordSchema } from '../common/schemas/primitives';
import {
  Card,
  CardHeader,
  CardContent,
  SegmentedControl,
  Input,
  Button,
  Divider,
  GoogleButton,
  TrustBadge,
} from '../components/ui';

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
        setServerError(
          axiosErr.response?.data?.error?.message || 'Login failed. Please try again.'
        );
      } else {
        setServerError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 antialiased">
      <Card>
        <CardHeader title="Finance Tracker Pro">
          <SegmentedControl
            activeValue="login"
            options={[
              { label: 'Login', value: 'login' },
              { label: 'Register', value: 'register', to: '/register' },
            ]}
          />
        </CardHeader>

        <CardContent>
          {serverError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[18px]">error</span>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <Input
              label="Email Address"
              icon="mail"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              icon="lock"
              isPassword
              placeholder="••••••••"
              error={errors.password?.message}
              rightAction={
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-primary-container hover:underline"
                >
                  Forgot Password?
                </Link>
              }
              {...register('password')}
            />

            <Button type="submit" loading={isSubmitting} loadingText="Signing in...">
              Sign In
            </Button>

            <Divider label="OR" />

            <GoogleButton />
          </form>

          <TrustBadge text="We never ask for your bank credentials" />
        </CardContent>
      </Card>
    </div>
  );
}
