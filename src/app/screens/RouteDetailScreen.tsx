import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import L from "leaflet";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { Navigation, ChevronRight, MapPin, Bus, Clock } from "lucide-react";
import { routePoints, buses } from "../data/mockData";

const FARE = "S/ 1.50";

type Direction = "outbound" | "return";

const directionLabels: Record<Direction, string> = {
  outbound: "Ida",
  return: "Vuelta",
};

const directionRouteLabels: Record<Direction, string> = {
  outbound: "Terminal Naranjal → Los Pinos",
  return: "Los Pinos → Terminal Naranjal",
};

const busStopIcon = L.divIcon({
  className: "custom-bus-stop-marker",
  html: `
    <div class="bus-stop-marker">
      <span>🚏</span>
    </div>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -20],
});

const activeBusStopIcon = L.divIcon({
  className: "custom-bus-stop-marker active",
  html: `
    <div class="bus-stop-marker active">
      <span>🚏</span>
    </div>
  `,
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -28],
});

const busIcon = L.divIcon({
  className: "custom-bus-marker",
  html: `
    <div class="bus-marker">
      <span>🚌</span>
    </div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  popupAnchor: [0, -24],
});

function MapFlyToStop({ selectedStop }: { selectedStop: any }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedStop) return;

    map.flyTo([selectedStop.lat, selectedStop.lng], 15, {
      duration: 1.1,
    });
  }, [selectedStop, map]);

  return null;
}

export function RouteDetailScreen() {
  const [searchParams] = useSearchParams();

  const initialStopId = searchParams.get("stopId");
  const initialStop =
    routePoints.find((point) => point.id === initialStopId) || routePoints[0];

  const [selectedStop, setSelectedStop] = useState(initialStop);

  useEffect(() => {
    const stopId = searchParams.get("stopId");
    const stop = routePoints.find((point) => point.id === stopId);

    if (stop) {
      setSelectedStop(stop);
    }
  }, [searchParams]);

  const [direction, setDirection] = useState<Direction>("outbound");

  const displayRoutePoints =
    direction === "outbound" ? routePoints : [...routePoints].reverse();

  const activeDirectionLabel = directionRouteLabels[direction];
  
  return (
    <div className="h-full flex flex-col bg-background">
      <div className="bg-gradient-to-r from-primary/90 to-secondary/90 text-white px-4 py-5">
        <h1 className="text-2xl font-bold mb-1">Recorrido Completo</h1>
        <p className="text-sm opacity-90">
          Alimentador Metropolitano Bertello (AN-14)
        </p>
        <p className="text-xs opacity-80 mt-1">
          {routePoints.length} paraderos • {activeDirectionLabel}
        </p>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 space-y-4">
          <div className="bg-card rounded-2xl p-4 border border-border shadow-sm">
            <div className="grid grid-cols-4 gap-3">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">
                  {routePoints.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Paraderos</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-secondary">55</p>
                <p className="text-xs text-muted-foreground mt-1">Min total</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-accent">22</p>
                <p className="text-xs text-muted-foreground mt-1">Km ruta</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{FARE}</p>
                <p className="text-xs text-muted-foreground mt-1">Pasaje</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted p-1">
            {(["outbound", "return"] as Direction[]).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setDirection(item);

                  const newSelectedStop =
                    item === "outbound"
                      ? routePoints[0]
                      : routePoints[routePoints.length - 1];

                  setSelectedStop(newSelectedStop);
                }}
                className={`rounded-xl py-3 text-sm font-semibold transition ${
                  direction === item
                    ? "bg-card text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="block">{directionLabels[item]}</span>
                <span className="block text-[11px] font-normal opacity-70">
                  {directionRouteLabels[item]}
                </span>
              </button>
            ))}
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-visible shadow-sm">
            <div className="sticky top-0 z-20 bg-background pt-2 pb-3">
              <div className="relative h-[360px] overflow-hidden rounded-[24px] border border-gray-200 bg-gray-100 shadow-sm">
                <MapContainer
                  center={[routePoints[0].lat, routePoints[0].lng]}
                  zoom={15}
                  minZoom={13}
                  maxZoom={19}
                  scrollWheelZoom={true}
                  zoomControl={false}
                  className="h-full w-full route-map"
                >
                  <MapFlyToStop selectedStop={selectedStop} />

                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors &copy; CARTO'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />

                  <Polyline
                    positions={displayRoutePoints.map(
                      (point) => [point.lat, point.lng] as [number, number]
                    )}
                    pathOptions={{
                      color: "#2563EB",
                      weight: 3,
                      opacity: 0.18,
                      lineCap: "round",
                      lineJoin: "round",
                    }}
                  />

                  <Polyline
                    positions={displayRoutePoints.map(
                      (point) => [point.lat, point.lng] as [number, number]
                    )}
                    pathOptions={{
                      color: "#F59E0B",
                      weight: 2,
                      opacity: 0.28,
                      dashArray: "5 9",
                      lineCap: "round",
                      lineJoin: "round",
                    }}
                  />

                  {displayRoutePoints.map((point) => (
                    <Marker
                      key={point.id}
                      position={[point.lat, point.lng] as [number, number]}
                      icon={
                        selectedStop?.id === point.id
                          ? activeBusStopIcon
                          : busStopIcon
                      }
                      eventHandlers={{
                        click: () => setSelectedStop(point),
                      }}
                    >
                      <Popup>
                        <strong>
                          {point.order}. {point.name}
                        </strong>
                        <br />
                        Paradero de la ruta Bertello
                      </Popup>
                    </Marker>
                  ))}

                  {buses.slice(0, 1).map((bus) => (
                    <Marker
                      key={bus.id}
                      position={[bus.lat, bus.lng] as [number, number]}
                      icon={busIcon}
                    >
                      <Popup>
                        <strong>Bus {bus.plateNumber}</strong>
                        <br />
                        Referencia de operación
                        <br />
                        Próximo: {bus.nextStop}
                      </Popup>
                    </Marker>
                  ))}

                  <ZoomControl position="bottomright" />
                </MapContainer>

                <div className="absolute left-4 top-4 z-[500] rounded-2xl bg-white/95 px-4 py-3 shadow-md backdrop-blur">
                  <p className="text-xs text-gray-500">Ruta GPS</p>
                  <p className="text-sm font-semibold text-gray-900">
                    Terminal Naranjal → Los Pinos
                  </p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-[500] rounded-2xl bg-white/95 px-4 py-3 shadow-md backdrop-blur">
                  <p className="text-xs text-gray-500">
                    Paradero seleccionado
                  </p>
                  <p className="text-sm font-semibold text-gray-900">
                    {selectedStop?.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-semibold mb-1 text-foreground flex items-center gap-2">
                <Navigation className="w-5 h-5 text-primary" />
                Secuencia de Paraderos
              </h3>

              <p className="text-xs text-muted-foreground mb-3">
                Toca un paradero para enfocarlo en el mapa.
              </p>

              <div className="space-y-2">
                {displayRoutePoints.map((point, index) => (
                  <button
                    key={point.id}
                    type="button"
                    onClick={() => setSelectedStop(point)}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                      selectedStop?.id === point.id
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-white hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                          selectedStop?.id === point.id
                            ? "bg-primary text-primary-foreground"
                            : index === displayRoutePoints.length - 1
                            ? "bg-secondary text-secondary-foreground"
                            : "bg-secondary/10 text-secondary border border-secondary/30"
                        }`}
                      >
                        {point.order}
                      </div>

                      {index < displayRoutePoints.length - 1 && (
                        <div className="w-0.5 h-8 bg-border mt-1"></div>
                      )}
                    </div>

                    <div className="flex-1 flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />

                        <div>
                          <p className="font-medium text-sm text-foreground">
                            {point.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {index === 0
                              ? "Origen"
                              : index === displayRoutePoints.length - 1
                              ? "Destino"
                              : `~${3 + index * 2} min desde origen`}
                          </p>
                        </div>
                      </div>

                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary/90 to-accent/90 rounded-2xl p-4 text-white shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <Bus className="w-6 h-6" />
              <h3 className="font-semibold">Horarios de Operación</h3>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-white/10 rounded-xl p-3">
                <p className="font-semibold mb-2 flex items-center justify-between">
                  <span>Terminal Naranjal → Los Pinos</span>
                  {direction === "outbound" && (
                    <span className="text-[10px] bg-white/20 rounded-full px-2 py-1">
                      Seleccionado
                    </span>
                  )}
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="opacity-90">Lunes a Sábado:</span>
                    <span className="font-semibold">05:30 AM - 12:00 AM</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="opacity-90">Domingo:</span>
                    <span className="font-semibold">05:30 AM - 11:00 PM</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-3">
                <p className="font-semibold mb-2 flex items-center justify-between">
                  <span>Los Pinos → Terminal Naranjal</span>
                  {direction === "return" && (
                    <span className="text-[10px] bg-white/20 rounded-full px-2 py-1">
                      Seleccionado
                    </span>
                  )}
                </p>

                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="opacity-90">Lunes a Sábado:</span>
                    <span className="font-semibold">05:00 AM - 11:30 PM</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="opacity-90">Domingo:</span>
                    <span className="font-semibold">05:00 AM - 10:30 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
              <Clock className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Frecuencia</p>
              <p className="font-semibold text-foreground">10-15 min</p>
            </div>

            <div className="bg-card border border-border rounded-xl p-3 shadow-sm">
              <Bus className="w-5 h-5 text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Tipo</p>
              <p className="font-semibold text-foreground">Alimentador</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}