import { useEffect, useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Bus, Eye, EyeOff, LoaderCircle, LockKeyhole, User } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(username.trim(), password);
      const destination =
        typeof location.state?.from === 'string' ? location.state.from : '/app';
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'No fue posible iniciar sesión.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen max-w-md mx-auto bg-gradient-to-br from-secondary via-primary to-accent p-6 flex items-center">
      <div className="w-full bg-card/95 backdrop-blur rounded-3xl shadow-2xl p-6 space-y-6">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
            <Bus className="w-11 h-11 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bienvenido</h1>
            <p className="text-sm text-muted-foreground">
              Ingresa a Bertello Track
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Usuario</span>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tu usuario"
                required
              />
            </div>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-foreground">Contraseña</span>
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full h-12 pl-11 pr-12 rounded-xl border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-primary"
                placeholder="Tu contraseña"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </label>

          {error && (
            <p className="rounded-xl bg-destructive/10 text-destructive text-sm px-4 py-3" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSubmitting && <LoaderCircle className="w-5 h-5 animate-spin" />}
            {isSubmitting ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Monitoreo en tiempo real · Ruta AN-14
        </p>
      </div>
    </div>
  );
}
