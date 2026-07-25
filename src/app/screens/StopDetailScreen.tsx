import { useParams, useNavigate } from "react-router";
import { ArrowLeft, MapPin, Clock, Users, Bus, Star } from "lucide-react";
import { stops } from "../data/mockData";

export function StopDetailScreen() {
  const { id } = useParams();
  const navigate = useNavigate();
  const stop = stops.find((s) => s.id === id);

  if (!stop) {
    return (
      <div className="h-full flex flex-col bg-background">
        <div className="p-4 border-b border-border bg-card">
          <h1 className="text-xl font-bold text-foreground">
            Paradero no encontrado
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            El paradero seleccionado no tiene detalle disponible.
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div>
            <p className="text-muted-foreground mb-4">
              Puedes revisar el recorrido completo para ubicar este punto.
            </p>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="rounded-xl bg-primary text-primary-foreground px-4 py-3 font-semibold"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getOccupancyColor = (occupancy: string) => {
    switch (occupancy) {
      case 'low': return 'bg-chart-4 text-white';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
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

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="bg-gradient-to-r from-primary to-accent text-white px-4 py-6">
        <button
          onClick={() => navigate('/app')}
          className="mb-4 p-2 hover:bg-white/10 rounded-lg transition-colors inline-flex"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-2">{stop.name}</h1>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <MapPin className="w-4 h-4" />
              <p>{stop.address}</p>
            </div>
          </div>
          <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
            <Star className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-semibold mb-3 text-foreground">Próximos Buses</h3>

            <div className="space-y-3">
              {stop.nextBuses.map((bus, index) => (
                <div
                  key={bus.busId}
                  className="flex items-center justify-between p-4 bg-gradient-to-r from-accent/5 to-transparent rounded-lg border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bus className="w-6 h-6 text-primary" />
                      </div>
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-secondary rounded-full border-2 border-card"></div>
                      )}
                    </div>

                    <div>
                      <p className="font-semibold text-foreground">{bus.plateNumber}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs px-2 py-1 rounded-full ${getOccupancyColor(bus.occupancy)}`}>
                          {getOccupancyLabel(bus.occupancy)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-1 text-2xl font-bold text-primary">
                      <Clock className="w-5 h-5" />
                      {bus.eta}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">minutos</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border">
            <h3 className="font-semibold mb-3 text-foreground">Información del Paradero</h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-input-background rounded-lg">
                <MapPin className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Ubicación</p>
                  <p className="text-xs text-muted-foreground">
                    {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-input-background rounded-lg">
                <Bus className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Buses Disponibles</p>
                  <p className="text-xs text-muted-foreground">
                    {stop.nextBuses.length} unidades en ruta
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 bg-input-background rounded-lg">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Tiempo de Espera Promedio</p>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(stop.nextBuses.reduce((acc, b) => acc + b.eta, 0) / stop.nextBuses.length)} minutos
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-secondary to-primary text-white rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <div>
                <p className="font-semibold">Afluencia Actual</p>
                <p className="text-sm opacity-90">Nivel medio de pasajeros esperando</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
