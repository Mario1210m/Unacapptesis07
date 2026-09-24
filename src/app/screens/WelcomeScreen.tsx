import { useNavigate } from "react-router";
import { Bus, MapPin, Bell, Clock } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";

export function WelcomeScreen() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(isAuthenticated ? '/app' : '/login', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-secondary via-primary to-accent max-w-md mx-auto px-6">
      <div className="text-center space-y-8">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="relative bg-white rounded-3xl p-8 shadow-2xl">
            <Bus className="w-20 h-20 text-primary mx-auto" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            BERTELLO
          </h1>
          <p className="text-lg text-white/95 font-medium">
            Monitoreo en Tiempo Real
          </p>
          <p className="text-sm text-white/80">
            Alimentador Metropolitano AN-14
          </p>
          <p className="text-xs text-white/70">
            Terminal Naranjal ↔ Los Pinos
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
            <MapPin className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs">Ubicación en Vivo</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
            <Clock className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs">Tiempo Real</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
            <Bus className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs">Flota Completa</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-white">
            <Bell className="w-6 h-6 mx-auto mb-2" />
            <p className="text-xs">Alertas Activas</p>
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
