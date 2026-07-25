# Bertello Track - Sistema de Monitoreo de Buses en Tiempo Real

## Descripción del Proyecto

Bertello Track es un prototipo de alta fidelidad de una aplicación móvil diseñada para el monitoreo en tiempo real de buses de transporte público de la **Ruta Bertello (AN-14)** - Alimentador Metropolitano de Lima.

La aplicación utiliza **datos reales** de la ruta oficial que conecta Terminal Naranjal con Los Pinos, con 16 paraderos a lo largo de Av. Alfredo Mendiola y zonas aledañas en los distritos de Los Olivos, Independencia y San Martín de Porres.

Este proyecto forma parte de una tesis universitaria de Ingeniería de Sistemas sobre aplicaciones móviles para mejorar el monitoreo de actividades en tiempo real de buses en paraderos.

## Características Principales

### 1. **Pantalla de Bienvenida**
- Diseño atractivo con gradiente de colores corporativos
- Animaciones fluidas de entrada
- Iconografía representativa del sistema de transporte
- Auto-navegación a la pantalla principal

### 2. **Pantalla Principal con Mapa**
- Visualización de mapa interactivo con ubicación de buses
- Identificación de paraderos cercanos
- Ubicación del usuario en tiempo real
- Lista de paraderos con tiempo estimado de llegada
- Buscador de paraderos
- Indicador del bus más cercano

### 3. **Detalle del Paradero**
- Información completa del paradero seleccionado
- Lista de próximos buses con tiempo estimado de llegada (ETA)
- Indicador de ocupación de cada bus (Disponible, Moderado, Lleno)
- Coordenadas GPS del paradero
- Tiempo de espera promedio
- Botón para agregar a favoritos

### 4. **Lista de Buses Disponibles**
- Vista de todos los buses activos en la ruta
- Estado en tiempo real de cada bus (A tiempo, Retrasado, Detenido)
- Información de paradero actual y próximo
- Nivel de ocupación visual
- Velocidad actual del bus
- ETA a próximo paradero

### 5. **Recorrido Completo de la Ruta**
- Mapa visual del recorrido completo
- Secuencia numerada de paraderos
- Información de distancia y tiempo total
- Horarios de operación por día
- Datos de frecuencia y tarifa
- Identificación clara de origen y destino

### 6. **Alertas y Notificaciones**
- Sistema de alertas clasificadas por tipo (Retrasos, Cambios, Info, Avisos)
- Indicador de alertas no leídas
- Filtros de visualización (Todas/Sin leer)
- Timeline de notificaciones
- Categorización visual por tipo de alerta

### 7. **Perfil de Usuario**
- Información del usuario
- Estadísticas de uso (viajes, favoritos, alertas)
- Gestión de paraderos favoritos
- Configuración de notificaciones personalizadas
- Ajustes de la aplicación
- Información de la versión

## Tecnologías Utilizadas

- **React 18.3.1** - Framework de UI
- **TypeScript** - Tipado estático
- **React Router 7** - Navegación entre pantallas
- **Tailwind CSS 4** - Estilos y diseño responsive
- **Lucide React** - Iconografía moderna
- **Vite 6** - Build tool y dev server

## Paleta de Colores - Metropolitano de Lima

El diseño utiliza los colores oficiales del Sistema Metropolitano de Lima:

- **Primary (Amarillo)**: `#F59E0B` - Color característico del Metropolitano
- **Secondary (Azul Oscuro)**: `#1E3A8A` - Color complementario del sistema
- **Accent (Amarillo Claro)**: `#FBBF24` - Elementos destacados
- **Success (Verde)**: `#10B981` - Estado positivo, ocupación baja
- **Destructive (Rojo)**: `#DC2626` - Alertas críticas, ocupación alta
- **Background**: `#F9FAFB` - Fondo limpio y profesional

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/
│   │   └── AppLayout.tsx          # Layout principal con navegación inferior
│   ├── data/
│   │   └── mockData.ts            # Datos de ejemplo (buses, paraderos, alertas)
│   ├── screens/
│   │   ├── WelcomeScreen.tsx      # Pantalla de bienvenida
│   │   ├── MainMapScreen.tsx      # Mapa principal
│   │   ├── StopDetailScreen.tsx   # Detalle de paradero
│   │   ├── BusListScreen.tsx      # Lista de buses
│   │   ├── RouteDetailScreen.tsx  # Recorrido completo
│   │   ├── AlertsScreen.tsx       # Alertas
│   │   └── ProfileScreen.tsx      # Perfil de usuario
│   ├── App.tsx                    # Componente raíz
│   └── routes.tsx                 # Configuración de rutas
└── styles/
    ├── theme.css                   # Variables de tema y estilos globales
    └── fonts.css                   # Importación de fuentes
```

## Datos Mock

La aplicación utiliza datos simulados realistas que incluyen:

- **4 buses activos** con ubicación GPS, estado, velocidad y ocupación
- **5 paraderos** con direcciones reales de Lima Metropolitana
- **4 alertas** de diferentes tipos (retrasos, cambios, info, avisos)
- **8 puntos de ruta** del recorrido completo

## Características Técnicas

### Navegación
- Navegación tipo aplicación móvil con barra inferior
- 5 secciones principales accesibles desde cualquier pantalla
- Indicadores visuales de sección activa
- Navegación fluida sin recargas

### Diseño Responsive
- Optimizado para dispositivos móviles
- Contenedor máximo de 448px (max-w-md) para simular pantalla móvil
- Diseño vertical con scroll en secciones extensas

### Interactividad
- Estados hover en elementos clickeables
- Animaciones sutiles en elementos clave
- Feedback visual en acciones del usuario
- Transiciones suaves entre estados

### Accesibilidad
- Estructura semántica HTML
- Contraste de colores adecuado
- Tamaños de fuente legibles
- Áreas de click apropiadas para touch

## Uso Académico

Este prototipo está diseñado específicamente para una tesis universitaria y demuestra:

1. **Diseño de Interfaz de Usuario (UI)**: Aplicación de principios de diseño moderno
2. **Experiencia de Usuario (UX)**: Flujos de navegación intuitivos
3. **Arquitectura de Software**: Estructura modular y escalable
4. **Visualización de Datos**: Presentación clara de información en tiempo real
5. **Sistemas de Notificación**: Gestión de alertas y actualizaciones

## Futuras Mejoras

Para una implementación real, se recomienda:

- Integración con API REST para datos en tiempo real
- Implementación de GPS real del dispositivo
- Sistema de autenticación de usuarios
- Base de datos para persistencia de favoritos
- Push notifications nativas
- Mapas reales (Google Maps / Mapbox)
- Analytics de uso
- Tests automatizados
- PWA para instalación en dispositivo

## Autor

Proyecto desarrollado como parte de Tesis de Ingeniería de Sistemas  
Universidad - 2026  
Lima Metropolitana, Perú

---

**Nota**: Este es un prototipo de alta fidelidad con datos simulados. No representa una aplicación funcional en producción.
