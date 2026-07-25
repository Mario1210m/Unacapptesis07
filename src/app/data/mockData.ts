export interface Bus {
  id: string;
  plateNumber: string;
  currentStop: string;
  nextStop: string;
  occupancy: 'low' | 'medium' | 'high';
  eta: number;
  lat: number;
  lng: number;
  speed: number;
  status: 'on-time' | 'delayed' | 'stopped';
}

export interface Stop {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  nextBuses: Array<{
    busId: string;
    plateNumber: string;
    eta: number;
    occupancy: 'low' | 'medium' | 'high';
  }>;
}

export interface Alert {
  id: string;
  type: 'delay' | 'change' | 'info' | 'warning';
  title: string;
  message: string;
  time: string;
  read: boolean;
  affectedStopId?: string;
  affectedBusId?: string;
}

export const buses: Bus[] = [
  {
    id: '1',
    plateNumber: 'AQP-871',
    currentStop: 'Las Palmeras',
    nextStop: 'Universitaria',
    occupancy: 'medium',
    eta: 3,
    lat: -12.0030,
    lng: -77.0640,
    speed: 28,
    status: 'on-time',
  },
  {
    id: '2',
    plateNumber: 'BER-123',
    currentStop: 'Izaguirre',
    nextStop: 'Dominicos',
    occupancy: 'high',
    eta: 4,
    lat: -12.0270,
    lng: -77.0800,
    speed: 22,
    status: 'on-time',
  },
  {
    id: '3',
    plateNumber: 'COL-456',
    currentStop: 'Santo Domingo',
    nextStop: 'Jardines de Naranjal',
    occupancy: 'low',
    eta: 2,
    lat: -12.0150,
    lng: -77.0720,
    speed: 32,
    status: 'on-time',
  },
  {
    id: '4',
    plateNumber: 'ATE-542',
    currentStop: 'Hospital Los Olivos',
    nextStop: 'Marcará',
    occupancy: 'medium',
    eta: 5,
    lat: -11.9970,
    lng: -77.0600,
    speed: 25,
    status: 'on-time',
  },
  {
    id: '5',
    plateNumber: 'NAR-789',
    currentStop: 'Pacasmayo',
    nextStop: 'Bertello',
    occupancy: 'medium',
    eta: 6,
    lat: -12.0330,
    lng: -77.0840,
    speed: 18,
    status: 'delayed',
  },
];

export const stops: Stop[] = [
  {
    id: '1',
    name: 'Unger',
    address: 'Terminal Naranjal - Punto de partida',
    lat: -11.9950,
    lng: -77.0580,
    nextBuses: [
      { busId: '1', plateNumber: 'AQP-871', eta: 3, occupancy: 'medium' },
      { busId: '4', plateNumber: 'ATE-542', eta: 8, occupancy: 'low' },
      { busId: '2', plateNumber: 'BER-123', eta: 12, occupancy: 'high' },
    ],
  },
  {
    id: '5',
    name: 'Universitaria',
    address: 'Av. Universitaria - Los Olivos',
    lat: -12.0060,
    lng: -77.0660,
    nextBuses: [
      { busId: '2', plateNumber: 'BER-123', eta: 4, occupancy: 'medium' },
      { busId: '3', plateNumber: 'COL-456', eta: 9, occupancy: 'low' },
    ],
  },
  {
    id: '9',
    name: 'Jardines de Naranjal',
    address: 'Urb. Jardines de Naranjal',
    lat: -12.0180,
    lng: -77.0740,
    nextBuses: [
      { busId: '3', plateNumber: 'COL-456', eta: 2, occupancy: 'low' },
      { busId: '1', plateNumber: 'AQP-871', eta: 7, occupancy: 'medium' },
    ],
  },
  {
    id: '12',
    name: 'Izaguirre',
    address: 'Av. Alfredo Mendiola con Izaguirre',
    lat: -12.0270,
    lng: -77.0800,
    nextBuses: [
      { busId: '4', plateNumber: 'ATE-542', eta: 5, occupancy: 'medium' },
      { busId: '2', plateNumber: 'BER-123', eta: 11, occupancy: 'high' },
    ],
  },
  {
    id: '15',
    name: 'Bertello',
    address: 'Estación Bertello - Independencia',
    lat: -12.0360,
    lng: -77.0860,
    nextBuses: [
      { busId: '1', plateNumber: 'AQP-871', eta: 6, occupancy: 'medium' },
      { busId: '3', plateNumber: 'COL-456', eta: 14, occupancy: 'low' },
    ],
  },
  {
    id: '16',
    name: 'Los Pinos',
    address: 'Terminal Los Pinos - Destino final',
    lat: -12.0390,
    lng: -77.0880,
    nextBuses: [
      { busId: '2', plateNumber: 'BER-123', eta: 8, occupancy: 'high' },
      { busId: '4', plateNumber: 'ATE-542', eta: 15, occupancy: 'medium' },
    ],
  },
];

export const alerts: Alert[] = [
  {
    id: '1',
    type: 'delay',
    title: 'Retraso en la ruta',
    message: 'El bus NAR-789 presenta un retraso de 8 minutos debido al tráfico en Av. Alfredo Mendiola.',
    time: 'Hace 12 min',
    read: false,
    affectedBusId: '5',
    affectedStopId: '12',
  },
  {
    id: '2',
    type: 'change',
    title: 'Desvío temporal',
    message: 'Por obras viales cerca de Izaguirre, los buses están tomando ruta alterna.',
    time: 'Hace 45 min',
    read: false,
    affectedStopId: '12',
  },
  {
    id: '3',
    type: 'info',
    title: 'Horario Alimentador Metropolitano',
    message: 'La Ruta Bertello opera de Lun-Sáb: 05:30-12:00am. Domingos: 05:30am-11:00pm.',
    time: 'Hace 2 horas',
    read: true,
  },
  {
    id: '4',
    type: 'warning',
    title: 'Alta demanda en Terminal Naranjal',
    message: 'Se detecta alta demanda en el paradero Unger. Se enviará un bus adicional en 5 minutos.',
    time: 'Hace 25 min',
    read: false,
    affectedStopId: '1',
  },
  {
    id: '5',
    type: 'info',
    title: 'Servicio regular',
    message: 'Todos los buses operan con normalidad en ambas direcciones (Naranjal ↔ Los Pinos).',
    time: 'Hace 4 horas',
    read: true,
  },
];

export const routePoints = [
  { id: '0', name: 'Terminal Naranjal', lat: -11.9804879, lng: -77.060066, order: 0 },
  { id: '1', name: 'Unger', lat: -11.9767497, lng: -77.0613799, order: 1 },
  { id: '2', name: 'Hospital Los Olivos', lat: -11.9769238, lng: -77.0656242, order: 2 },
  { id: '3', name: 'Marcará', lat: -11.9780701, lng: -77.0717124, order: 3 },
  { id: '4', name: 'Las Palmeras', lat: -11.9783579, lng: -77.0752887, order: 4 },
  { id: '5', name: 'Universitaria', lat: -11.978305, lng: -77.0797244, order: 5 },
  { id: '6', name: 'Huandoy', lat: -11.9766392, lng: -77.0846218, order: 6 },
  { id: '7', name: 'Portales de Naranjal', lat: -11.975197, lng: -77.0880256, order: 7 },
  { id: '8', name: 'Santo Domingo', lat: -11.977189, lng: -77.0922069, order: 8 },
  { id: '9', name: 'Jardines de Naranjal', lat: -11.9782168, lng: -77.0932032, order: 9 },
  { id: '10', name: 'Los Alisos', lat: -11.9823101, lng: -77.0978256, order: 10 },
  { id: '11', name: 'Los Olivos', lat: -11.9847973, lng: -77.100656, order: 11 },
  { id: '12', name: 'Izaguirre', lat: -11.98955, lng: -77.1070887, order: 12 },
  { id: '13', name: 'Dominicos', lat: -11.9914245, lng: -77.1085116, order: 13 },
  { id: '14', name: 'Pacasmayo', lat: -11.994869, lng: -77.1110162, order: 14 },
  { id: '15', name: 'Bertello', lat: -11.9965667, lng: -77.1132213, order: 15 },
  { id: '16', name: 'Los Pinos', lat: -11.99315, lng: -77.1157342, order: 16 },
];
