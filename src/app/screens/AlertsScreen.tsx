import { AlertCircle, Info, AlertTriangle, Megaphone, Clock, CheckCircle2 } from "lucide-react";
import { alerts } from "../data/mockData";
import { useState } from "react";
import { useNavigate } from "react-router";

export function AlertsScreen() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'delay':
        return <Clock className="w-5 h-5" />;
      case 'change':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
        return <Info className="w-5 h-5" />;
      case 'warning':
        return <Megaphone className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'delay':
        return 'bg-chart-3/10 text-chart-3 border-chart-3/20';
      case 'change':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'info':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'warning':
        return 'bg-secondary/10 text-secondary border-secondary/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => !a.read);
  const unreadCount = alerts.filter(a => !a.read).length;

  const goToAffectedPoint = (alert: any) => {
    if (alert.affectedBusId) {
      navigate(`/app?busId=${alert.affectedBusId}`);
      return;
    }

    if (alert.affectedStopId) {
      navigate(`/app/route?stopId=${alert.affectedStopId}`);
      return;
    }

    navigate("/app");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="bg-card border-b border-border px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Alertas</h1>
            <p className="text-sm text-muted-foreground">{unreadCount} sin leer</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-destructive/10 rounded-full">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-destructive">{unreadCount} nuevas</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-input-background text-muted-foreground hover:bg-muted'
            }`}
          >
            Todas ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-primary text-primary-foreground'
                : 'bg-input-background text-muted-foreground hover:bg-muted'
            }`}
          >
            Sin leer ({unreadCount})
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {filteredAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">No hay alertas nuevas</h3>
            <p className="text-sm text-muted-foreground">
              Todas las notificaciones han sido leídas
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAlerts.map((alert) => (
              <button
                key={alert.id}
                type="button"
                onClick={() => goToAffectedPoint(alert)}
                className={`w-full text-left bg-card rounded-xl p-4 border transition-all ${
                  alert.read
                    ? 'border-border opacity-70'
                    : 'border-primary/25 shadow-md'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg border ${getAlertColor(alert.type)}`}>
                    {getAlertIcon(alert.type)}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-foreground pr-2">{alert.title}</h3>
                      {!alert.read && (
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1.5"></div>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">{alert.message}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {alert.time}
                      </div>

                      {!alert.read && (
                        <button className="text-xs text-primary hover:underline">
                          Marcar como leída
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-card border-t border-border p-4">
        <div className="grid grid-cols-4 gap-2">
          <div className={`p-3 rounded-lg border text-center ${getAlertColor('info')}`}>
            <Info className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs">Info</p>
          </div>
          <div className={`p-3 rounded-lg border text-center ${getAlertColor('delay')}`}>
            <Clock className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs">Retrasos</p>
          </div>
          <div className={`p-3 rounded-lg border text-center ${getAlertColor('change')}`}>
            <AlertTriangle className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs">Cambios</p>
          </div>
          <div className={`p-3 rounded-lg border text-center ${getAlertColor('warning')}`}>
            <Megaphone className="w-5 h-5 mx-auto mb-1" />
            <p className="text-xs">Avisos</p>
          </div>
        </div>
      </div>
    </div>
  );
}
