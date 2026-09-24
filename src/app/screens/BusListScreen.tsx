import { useEffect, useState } from "react";
import { Bus, MapPin, Users, Gauge, AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router";
import { buses as fallbackBuses, type Bus as BusModel } from "../data/mockData";
import { transitApi } from "../data/transitApi";

export function BusListScreen() {
  const navigate = useNavigate();
  const [buses, setBuses] = useState<BusModel[]>(fallbackBuses);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const result = await transitApi.listBuses();
        if (!active) return;
        setBuses(result.filter(bus => bus.active).map(bus => ({
          id: bus.id,
          plateNumber: bus.plateNumber,
          currentStop: bus.currentStop,
          nextStop: bus.nextStop,
          occupancy: bus.occupancy,
          eta: bus.etaMinutes,
          lat: bus.latitude,
          lng: bus.longitude,
          speed: bus.speedKmh,
          status: bus.status,
        })));
        setUsingFallback(false);
        setLastUpdated(new Date());
      } catch {
        if (active) setUsingFallback(true);
      }
    };

    void refresh();
    const interval = window.setInterval(refresh, 15000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);
  const getOccupancyIcon = (occupancy: string) => {
    switch (occupancy) {
      case 'low': return <Users className="w-4 h-4 text-chart-4" />;
      case 'medium': return <Users className="w-4 h-4 text-primary" />;
      case 'high': return <Users className="w-4 h-4 text-destructive" />;
      default: return <Users className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getOccupancyLabel = (occupancy: string) => {
    switch (occupancy) {
      case 'low': return 'Disponible';
      case 'medium': return 'Moderado';
      case 'high': return 'Lleno';
      default: return 'Desconocido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'on-time': return <CheckCircle className="w-4 h-4 text-chart-4" />;
      case 'delayed': return <AlertCircle className="w-4 h-4 text-destructive" />;
      case 'stopped': return <Clock className="w-4 h-4 text-muted-foreground" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on-time': return 'A tiempo';
      case 'delayed': return 'Retrasado';
      case 'stopped': return 'Detenido';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="bg-card border-b border-border px-4 py-4">
        <h1 className="text-xl font-semibold text-foreground">Buses Activos</h1>
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Flota Ruta Bertello</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <RefreshCw className="h-3 w-3" />
            {usingFallback
              ? 'Modo demostración'
              : lastUpdated.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="mb-4 grid grid-cols-3 gap-3">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-primary">{buses.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total</p>
          </div>
          <div className="bg-chart-4/10 border border-chart-4/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-chart-4">
              {buses.filter(b => b.status === 'on-time').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">A tiempo</p>
          </div>
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold text-destructive">
              {buses.filter(b => b.status === 'delayed').length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Retrasados</p>
          </div>
        </div>

        <div className="space-y-3">
          {buses.map((bus) => (
            <button
              key={bus.id}
              type="button"
              onClick={() => navigate(`/app?busId=${bus.id}`)}
              className="w-full text-left bg-card border border-border rounded-xl p-4 shadow-sm hover:shadow-md hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Bus className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{bus.plateNumber}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusIcon(bus.status)}
                      <span className="text-xs text-muted-foreground">
                        {getStatusLabel(bus.status)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1 text-primary">
                    <Clock className="w-4 h-4" />
                    <span className="font-bold">{bus.eta} min</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">ETA</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Actual:</span>
                  <span className="font-medium text-foreground">{bus.currentStop}</span>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">Próximo:</span>
                  <span className="font-medium text-foreground">{bus.nextStop}</span>
                </div>

                <div className="flex items-center justify-between pt-2 mt-2 border-t border-border">
                  <div className="flex items-center gap-2">
                    {getOccupancyIcon(bus.occupancy)}
                    <span className="text-sm text-muted-foreground">Ocupación:</span>
                    <span className="text-sm font-medium text-foreground">
                      {getOccupancyLabel(bus.occupancy)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Gauge className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">{bus.speed} km/h</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <div className="w-full bg-input-background rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      bus.occupancy === 'low'
                        ? 'bg-chart-4 w-1/3'
                        : bus.occupancy === 'medium'
                        ? 'bg-primary w-2/3'
                        : 'bg-destructive w-full'
                    }`}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
