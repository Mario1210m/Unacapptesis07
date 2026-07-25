import { Outlet, useLocation, useNavigate } from "react-router";
import { Home, Bus, MapPin, Bell, User } from "lucide-react";

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/app', icon: Home, label: 'Inicio' },
    { path: '/app/buses', icon: Bus, label: 'Buses' },
    { path: '/app/route', icon: MapPin, label: 'Ruta' },
    { path: '/app/alerts', icon: Bell, label: 'Alertas' },
    { path: '/app/profile', icon: User, label: 'Perfil' },
  ];

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex flex-col h-screen bg-background max-w-md mx-auto">
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>

      <nav className="bg-card border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-lg transition-colors ${
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'fill-primary' : ''}`} />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
