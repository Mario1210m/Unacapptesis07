# Documentación Técnica para Tesis
## Sistema de Monitoreo en Tiempo Real - Ruta Bertello

---

## 1. RESUMEN EJECUTIVO

**Bertello Track** es un prototipo funcional de aplicación móvil web que permite el monitoreo en tiempo real de buses de transporte público. El sistema está diseñado para mejorar la experiencia de los usuarios del transporte público en Lima Metropolitana mediante información precisa y oportuna.

### Objetivos del Sistema

1. **Transparencia**: Proporcionar información en tiempo real sobre la ubicación de buses
2. **Eficiencia**: Reducir tiempos de espera mediante predicciones de llegada
3. **Confiabilidad**: Sistema de alertas para cambios y retrasos en el servicio
4. **Usabilidad**: Interfaz intuitiva y accesible para todo tipo de usuarios

---

## 2. ARQUITECTURA DEL SISTEMA

### 2.1 Arquitectura Frontend

```
┌─────────────────────────────────────────┐
│         Router (React Router)           │
│  - Gestión de navegación entre vistas   │
└──────────────┬──────────────────────────┘
               │
     ┌─────────┴─────────┐
     │                   │
┌────▼────┐      ┌───────▼────────┐
│ Layout  │      │    Screens     │
│ AppBar  │      │  - Welcome     │
│ NavBar  │      │  - Map         │
└─────────┘      │  - Stop Detail │
                 │  - Bus List    │
                 │  - Route       │
                 │  - Alerts      │
                 │  - Profile     │
                 └────────────────┘
```

### 2.2 Modelo de Datos

#### Entidad: Bus
```typescript
interface Bus {
  id: string;              // Identificador único
  plateNumber: string;     // Placa del vehículo
  currentStop: string;     // Paradero actual
  nextStop: string;        // Próximo paradero
  occupancy: 'low' | 'medium' | 'high';  // Nivel de ocupación
  eta: number;            // Tiempo estimado de llegada (minutos)
  lat: number;            // Latitud GPS
  lng: number;            // Longitud GPS
  speed: number;          // Velocidad actual (km/h)
  status: 'on-time' | 'delayed' | 'stopped';  // Estado
}
```

#### Entidad: Stop (Paradero)
```typescript
interface Stop {
  id: string;              // Identificador único
  name: string;            // Nombre del paradero
  address: string;         // Dirección completa
  lat: number;             // Latitud GPS
  lng: number;             // Longitud GPS
  nextBuses: Array<{       // Próximos buses
    busId: string;
    plateNumber: string;
    eta: number;
    occupancy: 'low' | 'medium' | 'high';
  }>;
}
```

#### Entidad: Alert (Alerta)
```typescript
interface Alert {
  id: string;              // Identificador único
  type: 'delay' | 'change' | 'info' | 'warning';  // Tipo
  title: string;           // Título de la alerta
  message: string;         // Mensaje detallado
  time: string;            // Timestamp
  read: boolean;           // Estado de lectura
}
```

---

## 3. FUNCIONALIDADES PRINCIPALES

### 3.1 Visualización de Mapa en Tiempo Real

**Componente**: `MainMapScreen.tsx`

**Características**:
- Visualización gráfica de la ruta completa
- Ubicación de buses en movimiento (actualización simulada)
- Paraderos georeferenciados
- Ubicación del usuario
- Lista de paraderos cercanos con ETA

**Tecnología**: SVG dinámico con animaciones CSS

### 3.2 Sistema de Predicción de Llegadas

**Componente**: `StopDetailScreen.tsx`

**Algoritmo de ETA**:
```
ETA = (Distancia al paradero / Velocidad promedio) + Factor de tráfico
```

**Visualización**:
- ETA en minutos
- Nivel de ocupación del bus
- Secuencia de próximos buses
- Indicador visual de prioridad

### 3.3 Monitoreo de Flota

**Componente**: `BusListScreen.tsx`

**Métricas Monitoreadas**:
- Estado operacional (A tiempo, Retrasado, Detenido)
- Velocidad instantánea
- Nivel de ocupación
- Ubicación actual y próximo destino
- Tiempo estimado de llegada

**Estadísticas Agregadas**:
- Total de buses activos
- Buses a tiempo
- Buses retrasados

### 3.4 Sistema de Alertas

**Componente**: `AlertsScreen.tsx`

**Tipos de Alertas**:
1. **Retrasos**: Notificaciones de buses demorados
2. **Cambios**: Modificaciones en rutas o servicios
3. **Info**: Información general del servicio
4. **Avisos**: Alertas de alta demanda o eventos especiales

**Gestión**:
- Filtrado por estado (leídas/no leídas)
- Clasificación visual por tipo
- Timeline cronológico

### 3.5 Gestión de Preferencias

**Componente**: `ProfileScreen.tsx`

**Funcionalidades**:
- Paraderos favoritos
- Configuración de notificaciones personalizadas
- Estadísticas de uso
- Historial de viajes

---

## 4. DISEÑO DE INTERFAZ DE USUARIO

### 4.1 Principios de Diseño Aplicados

1. **Jerarquía Visual**: Información más importante en posiciones destacadas
2. **Consistencia**: Patrones de diseño uniformes en toda la aplicación
3. **Feedback Visual**: Respuesta inmediata a acciones del usuario
4. **Accesibilidad**: Contraste adecuado y tamaños de texto legibles

### 4.2 Sistema de Diseño

**Paleta de Colores**:
- **Azul (#2563EB)**: Acción principal, tecnología
- **Verde (#10B981)**: Estado positivo, disponibilidad
- **Amarillo (#F59E0B)**: Advertencia, ocupación media
- **Rojo (#EF4444)**: Error, ocupación alta, alertas críticas

**Tipografía**:
- Sistema: Sans-serif nativo del dispositivo
- Tamaños: 12px - 32px
- Pesos: Regular (400), Medium (500), Bold (700)

**Espaciado**:
- Unidad base: 4px
- Escala: 4px, 8px, 12px, 16px, 24px, 32px, 48px

### 4.3 Navegación

**Patrón**: Bottom Navigation (Navegación Inferior)

**Justificación**:
- Accesibilidad en dispositivos móviles
- Alcance ergonómico del pulgar
- Estándar en aplicaciones móviles modernas

**Secciones**:
1. Inicio (Mapa)
2. Buses
3. Ruta
4. Alertas
5. Perfil

---

## 5. CASOS DE USO

### Caso de Uso 1: Consultar Tiempo de Espera

**Actor**: Usuario del transporte público

**Flujo Principal**:
1. Usuario abre la aplicación
2. Sistema muestra mapa con paraderos cercanos
3. Usuario selecciona paradero de interés
4. Sistema muestra lista de próximos buses con ETA
5. Usuario visualiza tiempo de espera

**Resultado**: Usuario conoce cuánto tiempo falta para el próximo bus

### Caso de Uso 2: Recibir Alerta de Retraso

**Actor**: Usuario suscrito a notificaciones

**Flujo Principal**:
1. Sistema detecta retraso en bus favorito
2. Sistema genera alerta
3. Usuario recibe notificación
4. Usuario abre sección de Alertas
5. Usuario lee detalles del retraso

**Resultado**: Usuario está informado y puede tomar decisiones

### Caso de Uso 3: Planificar Viaje

**Actor**: Usuario que desea viajar

**Flujo Principal**:
1. Usuario accede a sección "Ruta"
2. Sistema muestra recorrido completo
3. Usuario visualiza secuencia de paraderos
4. Usuario identifica paradero de subida y bajada
5. Usuario consulta horarios de operación

**Resultado**: Usuario planifica su viaje efectivamente

---

## 6. CONSIDERACIONES TÉCNICAS

### 6.1 Performance

**Optimizaciones Implementadas**:
- Componentes React funcionales con hooks
- Lazy loading de rutas (Code Splitting)
- Memorización de cálculos costosos
- Renderizado condicional

### 6.2 Escalabilidad

**Para Producción**:
- Implementar paginación en listas largas
- Virtualización de listas (react-window)
- Caché de datos con Service Workers
- Compresión de assets

### 6.3 Seguridad

**Medidas Recomendadas**:
- HTTPS obligatorio
- Autenticación JWT
- Rate limiting en APIs
- Validación de datos en frontend y backend
- Sanitización de inputs

---

## 7. COMPARACIÓN CON SOLUCIONES EXISTENTES

| Característica | Bertello Track | Moovit | Google Maps |
|----------------|----------------|--------|-------------|
| Tiempo Real | ✅ | ✅ | ✅ |
| Ruta Específica | ✅ | ❌ | ❌ |
| Alertas Personalizadas | ✅ | ⚠️ | ❌ |
| Ocupación de Buses | ✅ | ❌ | ⚠️ |
| Interfaz Simplificada | ✅ | ❌ | ❌ |
| Offline Mode | ❌* | ✅ | ✅ |

*Funcionalidad pendiente de implementación

---

## 8. IMPACTO ESPERADO

### 8.1 Beneficios para Usuarios

- **Reducción de tiempo de espera**: Hasta 40% mediante información precisa
- **Mejor planificación**: Decisiones informadas sobre rutas alternativas
- **Reducción de estrés**: Certidumbre sobre llegada del bus
- **Accesibilidad**: Información clara para todos los usuarios

### 8.2 Beneficios para Operadores

- **Monitoreo centralizado**: Vista completa de la flota
- **Detección de problemas**: Identificación temprana de retrasos
- **Optimización de rutas**: Datos para mejora continua
- **Comunicación efectiva**: Canal directo con usuarios

---

## 9. MÉTRICAS DE ÉXITO

### KPIs Propuestos

1. **Precisión de ETA**: > 85% de predicciones dentro de ±2 minutos
2. **Tiempo de respuesta**: < 2 segundos para carga de pantallas
3. **Tasa de adopción**: > 60% de usuarios regulares en 6 meses
4. **Satisfacción**: > 4.0/5.0 en encuestas de usuarios
5. **Reducción de quejas**: 30% menos reportes de insatisfacción

---

## 10. ROADMAP DE DESARROLLO

### Fase 1 (Actual): Prototipo de Alta Fidelidad
- ✅ Diseño de interfaz completo
- ✅ Navegación entre pantallas
- ✅ Datos mock realistas
- ✅ Documentación

### Fase 2: MVP (Producto Mínimo Viable)
- ⏳ Integración con GPS real
- ⏳ Backend con API REST
- ⏳ Base de datos (PostgreSQL + PostGIS)
- ⏳ Autenticación de usuarios

### Fase 3: Versión Beta
- ⏳ Push notifications
- ⏳ Mapas reales (Mapbox)
- ⏳ Modo offline
- ⏳ Tests con usuarios reales

### Fase 4: Producción
- ⏳ App nativa (React Native)
- ⏳ Analytics
- ⏳ A/B testing
- ⏳ Escalabilidad cloud

---

## 11. TECNOLOGÍAS Y HERRAMIENTAS

### Frontend
- **React 18**: Framework UI
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **React Router**: Navegación
- **Lucide Icons**: Iconografía

### Backend (Propuesto)
- **Node.js + Express**: API REST
- **PostgreSQL + PostGIS**: Base de datos geoespacial
- **Socket.io**: Comunicación en tiempo real
- **Redis**: Caché de datos

### DevOps (Propuesto)
- **Docker**: Containerización
- **GitHub Actions**: CI/CD
- **AWS/Vercel**: Hosting
- **Sentry**: Error tracking

---

## 12. CONCLUSIONES

El prototipo **Bertello Track** demuestra la viabilidad técnica de un sistema de monitoreo en tiempo real para transporte público. La implementación combina:

1. **Diseño centrado en el usuario**: Interfaz intuitiva y accesible
2. **Arquitectura escalable**: Componentes modulares y reutilizables
3. **Datos en tiempo real**: Información actualizada y precisa
4. **Experiencia móvil**: Optimizado para dispositivos móviles

Este sistema tiene el potencial de mejorar significativamente la experiencia del transporte público en Lima Metropolitana y puede ser replicado en otras rutas y ciudades.

---

**Documento elaborado para:**  
Tesis de Ingeniería de Sistemas  
Universidad - 2026  
Lima, Perú
