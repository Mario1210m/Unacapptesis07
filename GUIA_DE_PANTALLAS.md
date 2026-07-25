# Guía de Pantallas - Bertello Track
## Descripción Detallada de cada Interfaz

---

## 📱 PANTALLA 1: BIENVENIDA (WelcomeScreen)

### Ruta: `/`

### Propósito
Pantalla inicial que da la bienvenida al usuario y establece la identidad visual de la aplicación.

### Elementos Visuales

1. **Fondo**
   - Gradiente de azul a verde (primary → accent → secondary)
   - Efecto de profundidad y modernidad
   - Representa tecnología y movilidad

2. **Logo Central**
   - Icono de bus dentro de un círculo blanco
   - Efecto de resplandor con blur
   - Animación de pulso sutil

3. **Título**
   - "Bertello Track" en tipografía grande y bold
   - Subtítulo: "Monitoreo en Tiempo Real"
   - Descripción: "Ruta Bertello - Lima Metropolitana"

4. **Grid de Características** (2x2)
   - Ubicación en Vivo (icono de pin)
   - Tiempo Real (icono de reloj)
   - Flota Completa (icono de bus)
   - Alertas Activas (icono de campana)

5. **Indicador de Carga**
   - Tres puntos animados con bounce
   - Indica transición automática

### Comportamiento
- Se muestra durante 3 segundos
- Navega automáticamente a `/app` (mapa principal)
- Animaciones de entrada fluidas

### Valor para la Tesis
Demuestra la importancia de una primera impresión profesional y la identidad de marca clara.

---

## 🗺️ PANTALLA 2: MAPA PRINCIPAL (MainMapScreen)

### Ruta: `/app`

### Propósito
Vista principal del sistema que permite visualizar buses y paraderos en un mapa interactivo.

### Secciones

#### Header Superior
- **Título**: "Ruta Bertello"
- **Subtítulo**: "Lima Metropolitana"
- **Botón GPS**: Icono de navegación para centrar en ubicación del usuario
- **Buscador**: Campo de texto para buscar paraderos
- **Filtro**: Botón para opciones de filtrado

#### Área de Mapa (SVG Interactivo)
- **Fondo**: Gradiente azul-verde con grid simulando mapa
- **Línea de Ruta**: Línea azul punteada conectando paraderos
- **Paraderos**: Círculos blancos con borde azul y centro azul
  - Cantidad: 5 paraderos visibles
  - Clickeables para ver detalles
- **Buses**: Círculos verdes con emoji de bus
  - Animación de ping (efecto de radar)
  - 3 buses visibles en diferentes posiciones
- **Usuario**: Círculo azul pulsante mostrando ubicación actual

#### Panel Inferior
1. **Lista de Paraderos Cercanos**
   - Card blanco con sombra
   - Muestra los 3 paraderos más cercanos
   - Cada item incluye:
     - Icono de ubicación
     - Nombre del paradero
     - Dirección
     - Tiempo al próximo bus (en minutos)
     - Cantidad de buses disponibles

2. **Bus Más Cercano**
   - Banner verde destacado
   - Icono de bus
   - Placa del vehículo
   - Tiempo estimado
   - Etiqueta "En camino"

### Interacciones
- Click en paradero → Navega a detalle del paradero
- Click en paradero de la lista → Navega a detalle
- Búsqueda de paraderos (funcionalidad visual)

### Valor para la Tesis
Demuestra la visualización geoespacial de datos en tiempo real y la priorización de información relevante.

---

## 📍 PANTALLA 3: DETALLE DEL PARADERO (StopDetailScreen)

### Ruta: `/app/stop/:id`

### Propósito
Mostrar información detallada de un paradero específico y los próximos buses que llegarán.

### Secciones

#### Header (Fondo Azul)
- **Botón Atrás**: Flecha para volver al mapa
- **Nombre del Paradero**: Título grande (ej: "Plaza Dos de Mayo")
- **Dirección**: Icono de pin + dirección completa
- **Botón Favorito**: Estrella para agregar a favoritos

#### Card: Próximos Buses
- **Título**: "Próximos Buses"
- **Lista de Buses** (ordenados por ETA):
  - Icono circular de bus con indicador de "próximo" (punto verde)
  - Placa del vehículo
  - Etiqueta de ocupación:
    - Verde: "Disponible" (baja ocupación)
    - Amarillo: "Moderado" (media ocupación)
    - Rojo: "Lleno" (alta ocupación)
  - ETA en minutos (número grande con icono de reloj)

#### Card: Información del Paradero
- **Ubicación**: Coordenadas GPS (latitud, longitud)
- **Buses Disponibles**: Cantidad de unidades en ruta
- **Tiempo de Espera Promedio**: Cálculo automático basado en ETAs

#### Banner: Afluencia Actual
- Gradiente verde-azul
- Icono de usuarios
- Nivel de afluencia de pasajeros esperando

### Datos Mostrados
Para "Plaza Dos de Mayo":
- Dirección: Jr. Ancash con Av. Alfonso Ugarte
- Próximos 3 buses con ETAs de 3, 6 y 8 minutos
- Promedio de espera calculado

### Valor para la Tesis
Muestra cómo presentar información crítica de forma clara y accionable, con jerarquía visual efectiva.

---

## 🚌 PANTALLA 4: LISTA DE BUSES (BusListScreen)

### Ruta: `/app/buses`

### Propósito
Monitorear el estado de toda la flota activa en tiempo real.

### Secciones

#### Header
- **Título**: "Buses Activos"
- **Subtítulo**: "Flota Ruta Bertello"

#### Estadísticas Agregadas (Grid 3 columnas)
- **Total**: Buses activos (fondo verde claro)
- **A tiempo**: Buses sin retraso (fondo azul claro)
- **Retrasados**: Buses con demora (fondo rojo claro)

#### Lista de Buses (Cards)
Cada card muestra:

**Encabezado**:
- Icono de bus en círculo con gradiente azul-morado
- Placa del vehículo (ej: ABC-123)
- Estado operacional con icono:
  - ✅ A tiempo (verde)
  - ⚠️ Retrasado (rojo)
  - ⏸️ Detenido (gris)
- ETA destacado en la esquina superior derecha

**Información de Ubicación**:
- Paradero actual (icono gris)
- Próximo paradero (icono azul)

**Métricas Inferiores**:
- Nivel de ocupación con icono de usuarios
  - Disponible / Moderado / Lleno
- Velocidad actual (km/h) con icono de velocímetro

**Barra de Progreso**:
- Indicador visual de ocupación
- Colores: verde (baja), amarillo (media), rojo (alta)

### Datos de Ejemplo
Muestra 4 buses activos con diferentes estados:
- ABC-123: A tiempo, ocupación media, 25 km/h
- DEF-456: A tiempo, ocupación alta, 15 km/h
- GHI-789: A tiempo, ocupación baja, 30 km/h
- JKL-012: Retrasado, ocupación media, 20 km/h

### Valor para la Tesis
Demuestra la capacidad de monitoreo de flota completa y dashboard operacional con métricas clave.

---

## 🛣️ PANTALLA 5: RECORRIDO COMPLETO (RouteDetailScreen)

### Ruta: `/app/route`

### Propósito
Visualizar el recorrido completo de la ruta con todos sus paraderos y información operativa.

### Secciones

#### Header Gradiente
- Fondo: Gradiente azul a morado
- Título: "Recorrido Completo"
- Subtítulo: "Ruta Bertello - 8 paraderos"

#### Card de Estadísticas
Grid de 3 columnas:
- **Paraderos**: Total de puntos de parada (8)
- **Tiempo Total**: Duración del recorrido (45 min)
- **Distancia**: Kilómetros de ruta (18 km)

#### Visualización Gráfica (SVG)
- Mapa estilizado con línea de ruta ascendente
- Puntos numerados representando paraderos
- Gradiente de fondo azul-verde
- Icono de bus animado en posición intermedia

#### Lista de Paraderos Secuencial
Secuencia vertical con:
- **Número de orden** en círculo:
  - Primer paradero: verde (origen)
  - Último paradero: rojo (destino)
  - Intermedios: azul claro
- **Línea conectora** entre paraderos
- **Nombre del paradero**
- **Tiempo desde origen** (calculado)
  - Origen: "Origen"
  - Destino: "Destino"
  - Intermedios: "~X min desde origen"
- **Icono de flecha** entre paraderos

#### Paraderos de la Ruta:
1. Plaza Dos de Mayo (Origen)
2. Av. Venezuela
3. Av. Colonial
4. Av. Brasil
5. Av. Universitaria
6. Parque El Milagro
7. Av. La Marina
8. Plaza Norte (Destino)

#### Card: Horarios de Operación
- Fondo: Gradiente azul-morado
- Icono de bus
- **Lunes a Viernes**: 5:00 AM - 11:00 PM
- **Sábados**: 6:00 AM - 10:00 PM
- **Domingos**: 7:00 AM - 9:00 PM

#### Grid Inferior (2 columnas)
- **Frecuencia**: 8-12 minutos (icono de reloj)
- **Tarifa**: S/ 2.50 (icono de bus)

### Valor para la Tesis
Muestra la planificación de viaje completa y la visualización clara de datos operativos complejos.

---

## 🔔 PANTALLA 6: ALERTAS Y NOTIFICACIONES (AlertsScreen)

### Ruta: `/app/alerts`

### Propósito
Sistema centralizado de notificaciones y comunicación con usuarios.

### Secciones

#### Header
- **Título**: "Alertas"
- **Contador de no leídas**: "X sin leer"
- **Badge pulsante**: Indicador rojo con número de alertas nuevas

#### Filtros
Dos botones toggle:
- **Todas**: Muestra todas las alertas (4 total)
- **Sin leer**: Solo alertas no leídas (3)

#### Lista de Alertas (Cards)
Cada alerta incluye:

**Elementos Visuales**:
- Icono en círculo con color según tipo:
  - ⏰ Retrasos (amarillo)
  - ⚠️ Cambios (rojo)
  - ℹ️ Info (azul)
  - 📢 Avisos (verde)
- Punto azul si no está leída
- Borde resaltado para alertas no leídas

**Contenido**:
- Título en negrita
- Mensaje descriptivo
- Timestamp ("Hace X min/hora")
- Botón "Marcar como leída" (solo si no está leída)

#### Ejemplos de Alertas:

1. **Retraso** (No leída)
   - "Retraso en la ruta"
   - Bus ABC-123 con 5 min de retraso por tráfico
   - Hace 10 min

2. **Cambio** (No leída)
   - "Cambio de ruta temporal"
   - Obras en Av. Colonial, ruta alterna por Jr. Huaraz
   - Hace 1 hora

3. **Info** (Leída)
   - "Nuevo horario extendido"
   - Operación hasta las 11:00 PM desde mañana
   - Hace 3 horas

4. **Aviso** (No leído)
   - "Alta demanda detectada"
   - Bus adicional enviado a Plaza Dos de Mayo
   - Hace 30 min

#### Footer: Leyenda de Tipos
Grid de 4 botones mostrando iconografía:
- Info (azul)
- Retrasos (amarillo)
- Cambios (rojo)
- Avisos (verde)

### Estado Vacío
Cuando no hay alertas sin leer:
- Icono de check verde grande
- "No hay alertas nuevas"
- "Todas las notificaciones han sido leídas"

### Valor para la Tesis
Demuestra sistema de comunicación bidireccional y gestión de expectativas del usuario.

---

## 👤 PANTALLA 7: PERFIL DE USUARIO (ProfileScreen)

### Ruta: `/app/profile`

### Propósito
Configuración personal, favoritos y ajustes de la aplicación.

### Secciones

#### Header Gradiente
- Fondo: Gradiente azul → morado → verde
- Avatar circular con icono de usuario
- Nombre: "Usuario"
- Email: "usuario@bertello.pe"

#### Estadísticas Personales (Grid 3 columnas)
Cards con fondo semi-transparente:
- **Viajes**: 12 viajes realizados
- **Favoritos**: 3 paraderos guardados
- **Alertas**: 5 alertas activas

#### Card: Paraderos Favoritos
- Header: Icono de estrella + "Paraderos Favoritos"
- Lista de favoritos (3 items):
  - Plaza Dos de Mayo (Jr. Ancash con Av. Alfonso Ugarte) ❤️
  - Av. Brasil (Av. Brasil cdra. 15) ❤️
  - Parque El Milagro (Av. Universitaria con Alfredo Mendiola) ❤️
- Cada item:
  - Icono de ubicación en círculo azul
  - Nombre y dirección
  - Corazón rojo relleno
- Botón: "Ver todos los favoritos"

#### Card: Configuración de Notificaciones
- Header: Icono de campana + título
- **Toggles (switches)**:

1. **Alertas de retrasos** ✅
   - Recibir notificaciones de demoras
   - Estado: Activado

2. **Llegadas próximas** ✅
   - Avisar cuando el bus esté cerca
   - Estado: Activado

3. **Cambios de ruta** ❌
   - Notificar modificaciones de recorrido
   - Estado: Desactivado

#### Card: Más Opciones
- **Ajustes**
  - Icono de engranaje
  - Flecha derecha
  
- **Editar Perfil**
  - Icono de usuario
  - Flecha derecha

- **Cerrar Sesión**
  - Icono de salida (rojo)
  - Sin flecha
  - Efecto hover rojo

#### Footer
Información de la app:
- "Bertello Track v1.0.0"
- "Tesis de Ingeniería de Sistemas"
- "Universidad - 2026"

### Valor para la Tesis
Muestra la personalización de la experiencia y el control del usuario sobre sus datos y preferencias.

---

## 🧭 NAVEGACIÓN INFERIOR (AppLayout)

### Presente en: Todas las pantallas `/app/*`

### Estructura
Barra fija en la parte inferior con 5 botones:

1. **Inicio** (Home)
   - Icono: Casa
   - Ruta: `/app`
   - Lleva al mapa principal

2. **Buses** (Bus)
   - Icono: Bus
   - Ruta: `/app/buses`
   - Lista de buses activos

3. **Ruta** (MapPin)
   - Icono: Pin de mapa
   - Ruta: `/app/route`
   - Recorrido completo

4. **Alertas** (Bell)
   - Icono: Campana
   - Ruta: `/app/alerts`
   - Notificaciones

5. **Perfil** (User)
   - Icono: Usuario
   - Ruta: `/app/profile`
   - Configuración

### Comportamiento
- Botón activo: Azul con relleno
- Botones inactivos: Gris
- Texto pequeño debajo del icono
- Transición suave de color
- Siempre visible (fixed bottom)

### Valor para la Tesis
Demuestra patrones de navegación móvil estándar y accesibilidad ergonómica.

---

## 📊 RESUMEN DE ELEMENTOS DE DISEÑO

### Componentes Reutilizables
- Cards con sombra y borde redondeado
- Badges de estado (A tiempo, Retrasado, Disponible, etc.)
- Iconos circulares con fondo de color
- Listas con separadores
- Botones de acción primarios y secundarios
- Toggles/switches para configuración

### Colores Funcionales
- **Azul**: Principal, navegación, tecnología
- **Verde**: Positivo, disponible, confirmación
- **Amarillo**: Advertencia, moderado
- **Rojo**: Error, crítico, lleno, retrasado
- **Gris**: Inactivo, secundario

### Tipografía
- Headers: Bold, tamaño grande
- Subtítulos: Medium, tamaño medio
- Cuerpo: Regular, tamaño base
- Labels: Small, color secundario

### Espaciado Consistente
- Padding de cards: 16px
- Gaps entre elementos: 12px
- Margins de secciones: 16px
- Border radius: 12px

---

**Este documento describe todas las pantallas del prototipo Bertello Track para referencia en la tesis universitaria.**
