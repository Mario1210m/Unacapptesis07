import { User, MapPin, Bell, Star, Settings, LogOut, ChevronRight, Clock, Heart } from "lucide-react";
import { stops } from "../data/mockData";
import { useAuth } from "../auth/AuthContext";

export function ProfileScreen() {
  const favoriteStops = stops.slice(0, 3);
  const { user, logout } = useAuth();

  return (
    <div className="h-full flex flex-col bg-background overflow-auto">
      <div className="bg-gradient-to-br from-secondary via-primary to-accent text-white px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.displayName ?? 'Usuario'}</h1>
            <p className="text-sm opacity-90">{user?.email ?? ''}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs opacity-80">Viajes</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">{favoriteStops.length}</p>
            <p className="text-xs opacity-80">Favoritos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs opacity-80">Alertas</p>
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4">
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-input-background border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Paraderos Favoritos
            </h2>
          </div>

          <div className="divide-y divide-border">
            {favoriteStops.map((stop) => (
              <div key={stop.id} className="flex items-center justify-between p-4 hover:bg-input-background transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{stop.name}</p>
                    <p className="text-xs text-muted-foreground">{stop.address}</p>
                  </div>
                </div>
                <Heart className="w-5 h-5 text-destructive fill-destructive" />
              </div>
            ))}

            <button className="w-full p-4 text-sm text-primary hover:bg-input-background transition-colors">
              Ver todos los favoritos
            </button>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-input-background border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Configuración de Notificaciones
            </h2>
          </div>

          <div className="divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Alertas de retrasos</p>
                  <p className="text-xs text-muted-foreground">Recibir notificaciones de demoras</p>
                </div>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors cursor-pointer"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Llegadas próximas</p>
                  <p className="text-xs text-muted-foreground">Avisar cuando el bus esté cerca</p>
                </div>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors cursor-pointer"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">Cambios de ruta</p>
                  <p className="text-xs text-muted-foreground">Notificar modificaciones de recorrido</p>
                </div>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-muted rounded-full peer-checked:bg-primary transition-colors cursor-pointer"></div>
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="px-4 py-3 bg-input-background border-b border-border">
            <h2 className="font-semibold text-foreground">Más opciones</h2>
          </div>

          <div className="divide-y divide-border">
            <button className="w-full flex items-center justify-between p-4 hover:bg-input-background transition-colors">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Ajustes</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-input-background transition-colors">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Editar Perfil</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>

            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-between p-4 hover:bg-destructive/10 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-destructive" />
                <span className="font-medium text-destructive">Cerrar Sesión</span>
              </div>
            </button>
          </div>
        </div>

        <div className="text-center py-6 space-y-1">
          <p className="text-sm text-muted-foreground">Bertello Track v1.0.0</p>
          <p className="text-xs text-muted-foreground">
            Tesis de Ingeniería de Sistemas
          </p>
          <p className="text-xs text-muted-foreground">
            Universidad - 2026
          </p>
        </div>
      </div>
    </div>
  );
}
