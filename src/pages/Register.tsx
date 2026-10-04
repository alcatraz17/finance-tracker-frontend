import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/authStore';
import { emailSchema, passwordSchema, nameSchema } from '../common/schemas/primitives';
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

const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);
      await registerUser(data.email, data.password, data.name);
      navigate('/dashboard');
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { error?: { message?: string } } } };
        setServerError(
          axiosErr.response?.data?.error?.message || 'Registration failed. Please try again.'
        );
      } else {
        setServerError('Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 antialiased">
      <Card>
        <CardHeader title="Finance Tracker Pro">
          <SegmentedControl
            activeValue="register"
            options={[
              { label: 'Login', value: 'login', to: '/login' },
              { label: 'Register', value: 'register' },
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
              label="Full Name"
              icon="person"
              type="text"
              placeholder="John Doe"
              error={errors.name?.message}
              {...register('name')}
            />

            <Input
              label="Email Address"
              icon="mail"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Password"
              icon="lock"
              isPassword
              placeholder="••••••••"
              error={errors.password?.message}
              {...register('password')}
            />

            <p className="text-xs text-on-surface-variant pt-1 leading-relaxed">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary-container font-medium hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary-container font-medium hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <Button type="submit" loading={isSubmitting} loadingText="Creating account...">
              Create Account
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



