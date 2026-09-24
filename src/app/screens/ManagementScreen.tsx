import { useEffect, useState, type FormEvent } from 'react';
import { Bus, MapPinned, Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { transitApi, type BusInput, type RouteInput, type TransitBus, type TransitRoute } from '../data/transitApi';

const emptyRoute: RouteInput = {
  code: '',
  name: '',
  origin: '',
  destination: '',
  distanceKm: 1,
  active: true,
};

const emptyBus: BusInput = {
  plateNumber: '',
  routeId: null,
  status: 'on-time',
  occupancy: 'low',
  latitude: -11.98,
  longitude: -77.06,
  speedKmh: 0,
  etaMinutes: 0,
  distanceRemainingKm: 0,
  currentStop: 'Terminal Naranjal',
  nextStop: 'Unger',
  active: true,
};

export function ManagementScreen() {
  const [tab, setTab] = useState<'buses' | 'routes'>('buses');
  const [buses, setBuses] = useState<TransitBus[]>([]);
  const [routes, setRoutes] = useState<TransitRoute[]>([]);
  const [busForm, setBusForm] = useState<BusInput>(emptyBus);
  const [routeForm, setRouteForm] = useState<RouteInput>(emptyRoute);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const load = async () => {
    setLoading(true);
    setMessage('');
    try {
      const [busResult, routeResult] = await Promise.all([
        transitApi.listBuses(),
        transitApi.listRoutes(),
      ]);
      setBuses(busResult);
      setRoutes(routeResult);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo conectar con el servicio.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void load(); }, []);

  const closeForm = () => {
    setEditingId(null);
    setShowForm(false);
    setBusForm(emptyBus);
    setRouteForm(emptyRoute);
  };

  const submitBus = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (editingId) await transitApi.updateBus(editingId, busForm);
      else await transitApi.createBus(busForm);
      closeForm();
      setMessage(editingId ? 'Bus actualizado correctamente.' : 'Bus agregado correctamente.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar el bus.');
    }
  };

  const submitRoute = async (event: FormEvent) => {
    event.preventDefault();
    try {
      if (editingId) await transitApi.updateRoute(editingId, routeForm);
      else await transitApi.createRoute(routeForm);
      closeForm();
      setMessage(editingId ? 'Ruta actualizada correctamente.' : 'Ruta agregada correctamente.');
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo guardar la ruta.');
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(`¿Eliminar este ${tab === 'buses' ? 'bus' : 'recorrido'}?`)) return;
    try {
      if (tab === 'buses') await transitApi.deleteBus(id);
      else await transitApi.deleteRoute(id);
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'No se pudo eliminar.');
    }
  };

  return (
    <div className="min-h-full bg-slate-50 pb-6">
      <header className="bg-gradient-to-br from-primary to-blue-700 px-4 py-5 text-white">
        <p className="text-xs font-semibold tracking-wider opacity-80">CENTRO DE CONTROL</p>
        <h1 className="text-2xl font-bold">Gestión operativa</h1>
        <p className="mt-1 text-sm opacity-85">Administra la flota y los recorridos publicados.</p>
      </header>

      <main className="p-4">
        <div className="grid grid-cols-2 rounded-2xl bg-slate-200/70 p-1">
          {(['buses', 'routes'] as const).map((item) => (
            <button
              key={item}
              onClick={() => { setTab(item); closeForm(); }}
              className={`rounded-xl py-2.5 text-sm font-semibold ${tab === item ? 'bg-white text-primary shadow-sm' : 'text-slate-600'}`}
            >
              {item === 'buses' ? `Buses (${buses.length})` : `Rutas (${routes.length})`}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900">{tab === 'buses' ? 'Flota registrada' : 'Rutas disponibles'}</h2>
            <p className="text-xs text-slate-500">Los cambios se guardan en PostgreSQL.</p>
          </div>
          <div className="flex gap-2">
            <button aria-label="Actualizar" onClick={() => void load()} className="rounded-xl border bg-white p-2.5 text-slate-600">
              <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={() => { closeForm(); setShowForm(true); }}
              className="flex items-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" /> Agregar
            </button>
          </div>
        </div>

        {message && <div role="status" className="mt-4 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-800">{message}</div>}

        {showForm && (
          <section className="mt-4 rounded-2xl border bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">{editingId ? 'Editar' : 'Nuevo'} {tab === 'buses' ? 'bus' : 'recorrido'}</h3>
              <button aria-label="Cerrar formulario" onClick={closeForm}><X className="h-5 w-5" /></button>
            </div>

            {tab === 'buses' ? (
              <form onSubmit={submitBus} className="grid grid-cols-2 gap-3">
                <Field label="Placa"><input required maxLength={12} value={busForm.plateNumber} onChange={e => setBusForm({ ...busForm, plateNumber: e.target.value.toUpperCase() })} /></Field>
                <Field label="Ruta"><select value={busForm.routeId || ''} onChange={e => setBusForm({ ...busForm, routeId: e.target.value || null })}><option value="">Sin asignar</option>{routes.map(route => <option key={route.id} value={route.id}>{route.code}</option>)}</select></Field>
                <Field label="Estado"><select value={busForm.status} onChange={e => setBusForm({ ...busForm, status: e.target.value as BusInput['status'] })}><option value="on-time">A tiempo</option><option value="delayed">Retrasado</option><option value="stopped">Detenido</option></select></Field>
                <Field label="Ocupación"><select value={busForm.occupancy} onChange={e => setBusForm({ ...busForm, occupancy: e.target.value as BusInput['occupancy'] })}><option value="low">Disponible</option><option value="medium">Moderado</option><option value="high">Lleno</option></select></Field>
                <Field label="Paradero actual"><input required value={busForm.currentStop} onChange={e => setBusForm({ ...busForm, currentStop: e.target.value })} /></Field>
                <Field label="Próximo paradero"><input required value={busForm.nextStop} onChange={e => setBusForm({ ...busForm, nextStop: e.target.value })} /></Field>
                <NumberField label="ETA (min)" value={busForm.etaMinutes} onChange={etaMinutes => setBusForm({ ...busForm, etaMinutes })} />
                <NumberField label="Distancia (km)" step="0.1" value={busForm.distanceRemainingKm} onChange={distanceRemainingKm => setBusForm({ ...busForm, distanceRemainingKm })} />
                <NumberField label="Velocidad (km/h)" value={busForm.speedKmh} onChange={speedKmh => setBusForm({ ...busForm, speedKmh })} />
                <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={busForm.active} onChange={e => setBusForm({ ...busForm, active: e.target.checked })} /> En operación</label>
                <button className="col-span-2 rounded-xl bg-primary py-3 font-semibold text-white">Guardar bus</button>
              </form>
            ) : (
              <form onSubmit={submitRoute} className="grid grid-cols-2 gap-3">
                <Field label="Código"><input required value={routeForm.code} onChange={e => setRouteForm({ ...routeForm, code: e.target.value.toUpperCase() })} /></Field>
                <Field label="Nombre"><input required value={routeForm.name} onChange={e => setRouteForm({ ...routeForm, name: e.target.value })} /></Field>
                <Field label="Origen"><input required value={routeForm.origin} onChange={e => setRouteForm({ ...routeForm, origin: e.target.value })} /></Field>
                <Field label="Destino"><input required value={routeForm.destination} onChange={e => setRouteForm({ ...routeForm, destination: e.target.value })} /></Field>
                <NumberField label="Distancia (km)" step="0.1" value={routeForm.distanceKm} onChange={distanceKm => setRouteForm({ ...routeForm, distanceKm })} />
                <label className="flex items-end gap-2 pb-2 text-sm"><input type="checkbox" checked={routeForm.active} onChange={e => setRouteForm({ ...routeForm, active: e.target.checked })} /> Ruta activa</label>
                <button className="col-span-2 rounded-xl bg-primary py-3 font-semibold text-white">Guardar ruta</button>
              </form>
            )}
          </section>
        )}

        <div className="mt-4 space-y-3">
          {!loading && tab === 'buses' && buses.map(bus => (
            <article key={bus.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-blue-50 p-3 text-primary"><Bus className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><h3 className="font-bold">{bus.plateNumber}</h3><Status active={bus.active} /></div>
                  <p className="mt-1 text-sm text-slate-600">{bus.currentStop} → {bus.nextStop}</p>
                  <p className="mt-1 text-xs text-slate-500">{bus.etaMinutes} min · {bus.distanceRemainingKm.toFixed(1)} km · {bus.speedKmh} km/h</p>
                </div>
                <Actions onEdit={() => { setEditingId(bus.id); setBusForm({ ...bus, latitude: bus.latitude, longitude: bus.longitude }); setShowForm(true); }} onDelete={() => void remove(bus.id)} />
              </div>
            </article>
          ))}

          {!loading && tab === 'routes' && routes.map(route => (
            <article key={route.id} className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-amber-50 p-3 text-amber-600"><MapPinned className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><h3 className="font-bold">{route.code} · {route.name}</h3><Status active={route.active} /></div>
                  <p className="mt-1 text-sm text-slate-600">{route.origin} → {route.destination}</p>
                  <p className="mt-1 text-xs text-slate-500">{route.distanceKm.toFixed(1)} km de recorrido</p>
                </div>
                <Actions onEdit={() => { setEditingId(route.id); setRouteForm({ ...route }); setShowForm(true); }} onDelete={() => void remove(route.id)} />
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="text-xs font-semibold text-slate-600">{label}<div className="mt-1 [&>*]:w-full [&>*]:rounded-xl [&>*]:border [&>*]:px-3 [&>*]:py-2.5 [&>*]:text-sm">{children}</div></label>;
}

function NumberField({ label, value, step = '1', onChange }: { label: string; value: number; step?: string; onChange: (value: number) => void }) {
  return <Field label={label}><input type="number" min="0" step={step} value={value} onChange={e => onChange(Number(e.target.value))} /></Field>;
}

function Status({ active }: { active: boolean }) {
  return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${active ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{active ? 'ACTIVO' : 'INACTIVO'}</span>;
}

function Actions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return <div className="flex gap-1"><button aria-label="Editar" onClick={onEdit} className="rounded-lg p-2 text-primary hover:bg-blue-50"><Pencil className="h-4 w-4" /></button><button aria-label="Eliminar" onClick={onDelete} className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button></div>;
}
