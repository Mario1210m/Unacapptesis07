import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  ZoomControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import {
  Filter,
  LocateFixed,
  MapPin,
  Navigation2,
  RefreshCw,
  Ruler,
  Search,
  X,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import { buses, routePoints, stops } from "../data/mockData";

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

const getUserPositionNearRoute = (): [number, number] => {
  const nearbyStop = routePoints[1] || routePoints[0];

  return [
    nearbyStop.lat + 0.00008,
    nearbyStop.lng - 0.00008,
  ];
};

const userPosition: [number, number] = getUserPositionNearRoute();

type HomeFilter = "all" | "onTime" | "delayed" | "available" | "crowded";

const filterLabels: Record<HomeFilter, string> = {
  all: "Todos",
  onTime: "A tiempo",
  delayed: "Retrasados",
  available: "Disponibles",
  crowded: "Llenos",
};

const busStopIcon = L.divIcon({
  className: "home-stop-marker",
  html: `<div class="home-stop-marker-inner">🚏</div>`,
  iconSize: [42, 42],
  iconAnchor: [21, 21],
  popupAnchor: [0, -22],
});

const selectedStopIcon = L.divIcon({
  className: "home-stop-marker selected",
  html: `<div class="home-stop-marker-inner selected">🚏</div>`,
  iconSize: [54, 54],
  iconAnchor: [27, 27],
  popupAnchor: [0, -30],
});

const busIcon = L.divIcon({
  className: "home-bus-marker",
  html: `<div class="home-bus-marker-inner">🚌</div>`,
  iconSize: [58, 58],
  iconAnchor: [29, 29],
  popupAnchor: [0, -32],
});

const selectedBusIcon = L.divIcon({
  className: "home-bus-marker selected",
  html: `<div class="home-bus-marker-inner selected">🚌</div>`,
  iconSize: [72, 72],
  iconAnchor: [36, 36],
  popupAnchor: [0, -38],
});

const userIcon = L.divIcon({
  className: "home-user-marker",
  html: `
    <div class="home-user-pulse"></div>
    <div class="home-user-dot"></div>
  `,
  iconSize: [44, 44],
  iconAnchor: [22, 22],
});

function interpolatePosition(
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  ratio: number
) {
  return {
    lat: start.lat + (end.lat - start.lat) * ratio,
    lng: start.lng + (end.lng - start.lng) * ratio,
  };
}

function getBusPositionOnRoute(
  busIndex: number,
  tick: number,
  points: typeof routePoints
) {
  if (points.length < 2) {
    return {
      lat: points[0]?.lat || userPosition[0],
      lng: points[0]?.lng || userPosition[1],
      currentStop: points[0],
      nextStop: points[0],
      segmentIndex: 0,
    };
  }

  const maxSegment = points.length - 1;
  const speedOffset = busIndex * 2.9;
  const busSpeed = 0.14 + busIndex * 0.015;
  const rawPosition = (tick * busSpeed + speedOffset) % maxSegment;

  const segmentIndex = Math.floor(rawPosition);
  const ratio = rawPosition - segmentIndex;

  const start = points[segmentIndex];
  const end = points[segmentIndex + 1];

  const position = interpolatePosition(start, end, ratio);

  return {
    ...position,
    currentStop: start,
    nextStop: end,
    segmentIndex,
  };
}

function FocusMap({
  selectedBus,
  selectedBusId,
  selectedStop,
  selectedStopId,
  focusUserKey,
  followBusMode,
}: {
  selectedBus: any;
  selectedBusId: string | null;
  selectedStop: any;
  selectedStopId: string | null;
  focusUserKey: number;
  followBusMode: boolean;
}) {
  const map = useMap();
  const lastFocusKey = useRef("");

  useEffect(() => {
    if (focusUserKey === 0) return;

    lastFocusKey.current = "user-location";

    map.flyTo(userPosition, 17, {
      duration: 1,
      easeLinearity: 0.25,
    });
  }, [focusUserKey, map]);

  useEffect(() => {
    const focusKey = selectedBusId
      ? `bus-${selectedBusId}`
      : selectedStopId
      ? `stop-${selectedStopId}`
      : "";

    if (!focusKey || lastFocusKey.current === focusKey) return;

    lastFocusKey.current = focusKey;

    if (selectedBus) {
      map.flyTo([selectedBus.lat, selectedBus.lng], 17, {
        duration: 1,
        easeLinearity: 0.25,
      });
      return;
    }

    if (selectedStop) {
      map.flyTo([selectedStop.lat, selectedStop.lng], 17, {
        duration: 1,
        easeLinearity: 0.25,
      });
    }
  }, [selectedBusId, selectedStopId, selectedBus, selectedStop, map]);

  useEffect(() => {
    if (!followBusMode || !selectedBus) return;

    map.panTo([selectedBus.lat, selectedBus.lng], {
      animate: true,
      duration: 0.6,
    });
  }, [followBusMode, selectedBus?.lat, selectedBus?.lng, map]);

  return null;
}

function MapInteractionWatcher({
  onUserMove,
}: {
  onUserMove: () => void;
}) {
  useMapEvents({
    dragstart: onUserMove,
    zoomstart: onUserMove,
  });

  return null;
}

export function MainMapScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [tick, setTick] = useState(0);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => new Date());
  const [homeFilter, setHomeFilter] = useState<HomeFilter>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showNearbyStops, setShowNearbyStops] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [direction, setDirection] = useState<Direction>("outbound");
  const [focusUserKey, setFocusUserKey] = useState(0);
  const [followBusMode, setFollowBusMode] = useState(false);

  const [selectedBusId, setSelectedBusId] = useState<string | null>(
    searchParams.get("busId")
  );

  const [selectedStopId, setSelectedStopId] = useState<string | null>(
    searchParams.get("stopId")
  );

  useEffect(() => {
    const busId = searchParams.get("busId");
    const stopId = searchParams.get("stopId");

    if (busId) {
      setSelectedBusId(busId);
      setSelectedStopId(null);
    }

    if (stopId) {
      setSelectedStopId(stopId);
      setSelectedBusId(null);
    }
  }, [searchParams]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((current) => current + 1);
      setLastUpdatedAt(new Date());
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const displayRoutePoints = useMemo(() => {
    return direction === "outbound" ? routePoints : [...routePoints].reverse();
  }, [direction]);

  const activeDirectionLabel = directionRouteLabels[direction];

  const liveBuses = useMemo(() => {
    return buses.map((bus, index) => {
      const position = getBusPositionOnRoute(index, tick, displayRoutePoints);

      return {
        ...bus,
        lat: position.lat,
        lng: position.lng,
        currentStop: position.currentStop?.name || bus.currentStop,
        nextStop: position.nextStop?.name || bus.nextStop,
        eta: Math.max(1, 2 + ((position.segmentIndex + index) % 5)),
      };
    });
  }, [tick, displayRoutePoints]);

  const filteredBuses = useMemo(() => {
    return liveBuses.filter((bus) => {
      const matchesFilter =
        homeFilter === "all" ||
        (homeFilter === "onTime" && bus.status === "on-time") ||
        (homeFilter === "delayed" && bus.status === "delayed") ||
        (homeFilter === "available" && bus.occupancy === "low") ||
        (homeFilter === "crowded" && bus.occupancy === "high");

      const matchesSearch =
        searchText.trim() === "" ||
        bus.plateNumber.toLowerCase().includes(searchText.toLowerCase()) ||
        bus.nextStop.toLowerCase().includes(searchText.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [liveBuses, homeFilter, searchText]);

  const visibleBuses = useMemo(() => {
    if (!selectedBusId) return filteredBuses;

    const selected = liveBuses.find((bus) => bus.id === selectedBusId);

    if (!selected) return filteredBuses;

    const alreadyVisible = filteredBuses.some((bus) => bus.id === selectedBusId);

    return alreadyVisible ? filteredBuses : [selected, ...filteredBuses];
  }, [filteredBuses, liveBuses, selectedBusId]);

  const selectedBus = useMemo(
    () => liveBuses.find((bus) => bus.id === selectedBusId),
    [liveBuses, selectedBusId]
  );

  const selectedStop = useMemo(
    () => routePoints.find((point) => point.id === selectedStopId),
    [selectedStopId]
  );

  const nearestBus = useMemo(() => {
    return [...filteredBuses].sort((a, b) => a.eta - b.eta)[0] || liveBuses[0];
  }, [filteredBuses, liveBuses]);

  const selectedOrNearestBus = selectedBus || nearestBus;

  const filteredStops = useMemo(() => {
    return displayRoutePoints.filter((stop) => {
      if (searchText.trim() === "") return true;

      return stop.name.toLowerCase().includes(searchText.toLowerCase());
    });
  }, [searchText, displayRoutePoints]);

  const getOccupancyLabel = (occupancy: string) => {
    switch (occupancy) {
      case "low":
        return "Disponible";
      case "medium":
        return "Moderado";
      case "high":
        return "Lleno";
      default:
        return "Sin dato";
    }
  };

  const getStatusLabel = (status: string) => {
    return status === "delayed" ? "Retraso" : "A tiempo";
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="px-4 pt-4 pb-3 bg-white border-b border-slate-100">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-primary tracking-wide">
              BERTELLO TRACK
            </p>
            <h1 className="text-xl font-bold text-slate-900">
              Monitoreo en tiempo real
            </h1>
            <p className="text-sm text-slate-500">
              {activeDirectionLabel}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedBusId(null);
              setSelectedStopId(null);
              setFollowBusMode(false);
              setFocusUserKey((value) => value + 1);
            }}
            className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"
            title="Ir a mi ubicación"
          >
            <Navigation2 className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Buscar paradero o bus..."
              className="w-full pl-10 pr-10 py-3 bg-slate-100 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
            />

            {searchText && (
              <button
                type="button"
                onClick={() => setSearchText("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((value) => !value)}
            className={`h-12 w-12 rounded-2xl border flex items-center justify-center transition ${
              showFilters || homeFilter !== "all"
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-white text-slate-600 border-slate-200"
            }`}
            title="Filtros"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          {(["outbound", "return"] as Direction[]).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setDirection(item);
                setSelectedBusId(null);
                setSelectedStopId(null);
              }}
              className={`rounded-xl py-2 text-xs font-semibold transition ${
                direction === item
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span className="block">{directionLabels[item]}</span>
              <span className="block text-[10px] font-normal opacity-70">
                {directionRouteLabels[item]}
              </span>
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {(Object.keys(filterLabels) as HomeFilter[]).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setHomeFilter(filter);
                  setSelectedBusId(null);
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
                  homeFilter === filter
                    ? "bg-primary text-primary-foreground"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {filterLabels[filter]}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex-1 relative">
        <MapContainer
          center={userPosition}
          zoom={16}
          minZoom={14}
          maxZoom={19}
          zoomControl={false}
          scrollWheelZoom={true}
          className="h-full w-full home-live-map"
        >
          <FocusMap
            selectedBus={selectedBus}
            selectedBusId={selectedBusId}
            selectedStop={selectedStop}
            selectedStopId={selectedStopId}
            focusUserKey={focusUserKey}
            followBusMode={followBusMode}
          />

          <MapInteractionWatcher
            onUserMove={() => {
              setFollowBusMode(false);
            }}
          />

          <TileLayer
            attribution='&copy; OpenStreetMap contributors &copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <Polyline
            positions={displayRoutePoints.map(
              (point) => [point.lat, point.lng] as [number, number]
            )}
            pathOptions={{
              color: "#1D4ED8",
              weight: 4,
              opacity: 0.22,
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
              opacity: 0.32,
              dashArray: "6 10",
              lineCap: "round",
              lineJoin: "round",
            }}
          />

          {displayRoutePoints.map((point) => (
            <Marker
              key={point.id}
              position={[point.lat, point.lng] as [number, number]}
              icon={selectedStopId === point.id ? selectedStopIcon : busStopIcon}
              eventHandlers={{
                click: () => {
                  setSelectedStopId(point.id);
                  setSelectedBusId(null);
                  setFollowBusMode(false);
                },
              }}
            >
              <Popup>
                <strong>{point.name}</strong>
                <br />
                Paradero AN-14
              </Popup>
            </Marker>
          ))}

          {visibleBuses.map((bus) => (
            <Marker
              key={bus.id}
              position={[bus.lat, bus.lng] as [number, number]}
              icon={selectedBusId === bus.id ? selectedBusIcon : busIcon}
              eventHandlers={{
                click: () => {
                  setSelectedBusId(bus.id);
                  setSelectedStopId(null);
                  setFollowBusMode(false);
                },
              }}
            >
              <Popup>
                <strong>Bus {bus.plateNumber}</strong>
                <br />
                Llega en {bus.eta} min
                <br />
                Próximo: {bus.nextStop}
              </Popup>
            </Marker>
          ))}

          <Marker position={userPosition} icon={userIcon}>
            <Popup>Tu ubicación aproximada</Popup>
          </Marker>

          <ZoomControl position="bottomright" />
        </MapContainer>

        <div className="absolute left-4 right-4 top-4 z-[500] rounded-3xl bg-white/95 px-4 py-3 shadow-sm border border-slate-100 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <LocateFixed className="w-5 h-5" />
            </div>

            <div className="flex-1">
              <p className="text-xs text-slate-500">
                {selectedStop ? "Paradero seleccionado" : "Paradero recomendado"}
              </p>

              <p className="text-sm font-semibold text-slate-900">
                {selectedStop?.name || selectedOrNearestBus?.nextStop || "Sin datos"}
              </p>

              <p className="text-[11px] text-slate-400">
                {activeDirectionLabel}
              </p>

              {selectedStop && (
                <p className="text-[11px] text-slate-400 mt-1">
                  Toca “Ver” para revisar el recorrido completo
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                if (selectedStop?.id) {
                  navigate(`/app/route?stopId=${selectedStop.id}&direction=${direction}`);
                  return;
                }

                navigate(`/app/route?direction=${direction}`);
              }}
              className="text-xs font-semibold text-primary"
            >
              Ver
            </button>
          </div>
        </div>

        <div className="absolute left-4 right-4 bottom-4 z-[500] space-y-3">
          {selectedOrNearestBus && (
            <div className="rounded-3xl bg-white/95 p-4 shadow-lg border border-slate-100 backdrop-blur">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-slate-500">
                    {selectedStop
                      ? `Bus más cercano a ${selectedStop.name}`
                      : selectedBus
                      ? "Bus seleccionado"
                      : "Bus más cercano"}
                  </p>
                  <h2 className="text-xl font-bold text-slate-900">
                    {selectedOrNearestBus.plateNumber}
                  </h2>
                  <p className="text-sm text-slate-500">
                    Próximo paradero:{" "}
                    <span className="font-medium text-slate-800">
                      {selectedOrNearestBus.nextStop}
                    </span>
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500" aria-live="polite">
                    <RefreshCw className="h-3 w-3" />
                    Actualizado {lastUpdatedAt.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {selectedOrNearestBus.eta} min
                  </p>
                  <p className="text-xs text-slate-500">ETA</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <div className="rounded-2xl bg-slate-50 p-2">
                  <p className="text-xs text-slate-500">Ocupación</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {getOccupancyLabel(selectedOrNearestBus.occupancy)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-2">
                  <p className="text-xs text-slate-500">Velocidad</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedOrNearestBus.speed} km/h
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-2">
                  <p className="text-xs text-slate-500">Estado</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {getStatusLabel(selectedOrNearestBus.status)}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-2">
                  <p className="text-xs text-slate-500">Pasaje</p>
                  <p className="text-sm font-semibold text-slate-900">
                    {FARE}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-2xl bg-blue-50 px-3 py-2 text-sm">
                <span className="flex items-center gap-2 text-slate-600">
                  <Ruler className="h-4 w-4 text-primary" />
                  Distancia al próximo paradero
                </span>
                <strong className="text-primary">
                  {(selectedOrNearestBus.eta * 0.42).toFixed(1)} km
                </strong>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedBusId(selectedOrNearestBus.id);
                    setSelectedStopId(null);
                    setShowNearbyStops(false);
                    setFollowBusMode(true);
                  }}
                  className={`flex-1 rounded-2xl py-3 text-sm font-semibold transition ${
                    followBusMode && selectedBusId === selectedOrNearestBus.id
                      ? "bg-green-600 text-white"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {followBusMode && selectedBusId === selectedOrNearestBus.id
                    ? "Siguiendo bus"
                    : "Seguir bus"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFollowBusMode(false);
                    navigate("/app/buses");
                  }}
                  className="flex-1 rounded-2xl bg-slate-100 text-slate-700 py-3 text-sm font-semibold"
                >
                  Ver flota
                </button>
              </div>
            </div>
          )}

          <div className="rounded-3xl bg-white/95 p-3 shadow-sm border border-slate-100">
            <button
              type="button"
              onClick={() => setShowNearbyStops((value) => !value)}
              className="w-full flex items-center justify-between"
            >
              <p className="font-semibold text-slate-900">Paraderos cercanos</p>
              <span className="text-xs text-slate-500">
                {filteredStops.length} activos
              </span>
            </button>

            {showNearbyStops && (
              <div className="mt-3 grid grid-cols-1 gap-2 max-h-36 overflow-y-auto pr-1">
                {filteredStops.slice(0, 4).map((stop) => (
                  <button
                    key={stop.id}
                    type="button"
                    onClick={() => {
                      setSelectedStopId(stop.id);
                      setSelectedBusId(null);
                      setFollowBusMode(false);
                      setShowNearbyStops(false);
                    }}
                    className="flex items-center justify-between rounded-2xl bg-slate-50 px-3 py-2 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        <MapPin className="w-4 h-4" />
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {stop.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          Paradero {stop.order} · Ruta AN-14
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-primary">
                        {Math.max(2, stop.order + 2)} min
                      </p>
                      <p className="text-xs text-slate-500">buses cercanos</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
