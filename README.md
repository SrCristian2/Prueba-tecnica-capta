# API de Fechas Hábiles Colombia

API REST en TypeScript que calcula fechas hábiles en Colombia, considerando días festivos nacionales, horarios laborales y zonas horarias.

## 🚀 Características

- ✅ Cálculo de días y horas hábiles
- ✅ Consideración de festivos nacionales colombianos
- ✅ Horarios laborales (8:00 AM - 5:00 PM, almuerzo 12:00 PM - 1:00 PM)
- ✅ Manejo de zona horaria de Colombia (America/Bogota)
- ✅ Desplegado en Render como servicio web

## 🌐 Despliegue en Render

Esta API está configurada para desplegarse automáticamente en Render. Sigue estos pasos:

### Paso 1: Preparar el repositorio
1. Asegúrate de que todos los cambios estén commitados en tu repositorio de GitHub
2. El proyecto ya tiene la configuración necesaria en `render.yaml`

### Paso 2: Conectar con Render
1. Ve a [render.com](https://render.com) e inicia sesión con tu cuenta de GitHub
2. Haz clic en "New +" y selecciona "Web Service"
3. Conecta tu cuenta de GitHub si aún no lo has hecho
4. Busca y selecciona tu repositorio `Prueba-tecnica-capta`

### Paso 3: Configurar el proyecto
1. **Name**: `capta-api` (o el nombre que prefieras)
2. **Region**: Selecciona la región más cercana
3. **Branch**: `main` (o la rama que uses para producción)
4. **Runtime**: Render detectará automáticamente que es Node.js
5. **Build Command**: `npm install && npm run build`
6. **Start Command**: `npm start`
7. **Plan**: Selecciona "Free" para comenzar

### Paso 4: Variables de entorno (opcional)
- `NODE_ENV`: `production` (ya está configurado en `render.yaml`)
- Render configurará automáticamente el `PORT`

### Paso 5: Desplegar
1. Haz clic en "Create Web Service"
2. Render comenzará el proceso de build y deploy automáticamente
3. El despliegue inicial puede tomar unos minutos

### Paso 6: Verificar el despliegue
Una vez desplegado, tu API estará disponible en una URL como: `https://capta-api.onrender.com`

**Endpoints disponibles:**
- `GET /health` - Health check
- `GET /api/v1/calculate-working-date?days=5&date=2023-01-01` - Calcular fecha hábil

### Ejemplo de uso:
```bash
curl "https://capta-api.onrender.com/api/v1/calculate-working-date?days=5&date=2023-01-01"
```

### 🔄 Despliegue automático
- Render desplegará automáticamente cada vez que hagas push a la rama `main`
- Puedes ver los logs de build y deployment en el dashboard de Render
- El servicio incluye health checks automáticos en `/health`

### 💡 Características de Render
- ✅ **SSL/HTTPS automático**: Certificados SSL gratuitos
- ✅ **Escalado automático**: Se ajusta según la demanda
- ✅ **Health checks**: Monitoreo automático del estado del servicio
- ✅ **Logs en tiempo real**: Acceso completo a logs de aplicación
- ✅ **Variables de entorno**: Gestión segura de configuración

## 🛠️ Desarrollo Local
- ✅ Respuestas en UTC según ISO 8601
- ✅ Validación robusta de parámetros
- ✅ Tipado estricto en TypeScript

## 📋 Reglas de Negocio

- **Días laborales**: Lunes a viernes (excluyendo festivos)
- **Horario laboral**: 8:00 AM - 5:00 PM (hora colombiana)
- **Almuerzo**: 12:00 PM - 1:00 PM (no laboral)
- **Ajuste automático**: Si la fecha inicial está fuera del horario laboral, se ajusta hacia atrás al momento laboral más cercano
- **Festivos**: Se obtienen dinámicamente desde https://content.capta.co/Recruitment/WorkingDays.json

## 🛠️ Instalación y Ejecución Local

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd capta

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build
```

### Ejecución en desarrollo
```bash
npm run dev
```

### Ejecución en producción
```bash
npm start
```

La API estará disponible en `http://localhost:3000`

## 🐳 Ejecución con Docker (Desarrollo Local)

### Prerrequisitos
- Docker Desktop instalado y funcionando
- Docker Compose (incluido con Docker Desktop)

### Pasos para ejecutar con Docker

1. **Clonar el repositorio**
```bash
git clone <repository-url>
cd capta
```

2. **Ejecutar con Docker Compose**
```bash
# Levantar el entorno de desarrollo con hot reload
docker-compose up --build

# O ejecutar en segundo plano
docker-compose up --build -d

# Ver los logs en tiempo real (si está en segundo plano)
docker-compose logs -f capta-api
```

3. **Acceder a la API**
- La API estará disponible en: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- Endpoint principal: `http://localhost:3000/api/v1/calculate-working-date`

4. **Detener el entorno**
```bash
# Detener los contenedores
docker-compose down

# Detener y limpiar volúmenes (opcional)
docker-compose down -v
```

### Características del setup de desarrollo
- ✅ **Hot Reload**: Los cambios en el código se reflejan automáticamente
- ✅ **Aislamiento**: No necesitas Node.js instalado localmente
- ✅ **Consistencia**: Mismo entorno para todo el equipo
- ✅ **Simplicidad**: Un solo comando para levantar todo
- ✅ **Volúmenes optimizados**: Solo se montan los archivos necesarios

### Estructura de archivos importantes para Docker
```
├── Dockerfile              # Imagen para desarrollo
├── docker-compose.yml      # Orquestación del entorno
├── nodemon.json            # Configuración de hot reload
└── .dockerignore           # Archivos a ignorar en el build
```

### 🔧 Troubleshooting Docker

#### Error: Docker no está funcionando
```bash
# Verificar que Docker esté corriendo
docker --version
docker-compose --version

# En Windows, asegúrate de que Docker Desktop esté ejecutándose
```

#### Puerto 3000 ya está en uso
```bash
# Verificar qué está usando el puerto
netstat -ano | findstr :3000

# Cambiar el puerto en docker-compose.yml
ports:
  - "3001:3000"  # Usar puerto 3001 en lugar de 3000
```

#### Problemas con hot reload
```bash
# Reconstruir la imagen desde cero
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### Limpiar todo y empezar de nuevo
```bash
# Eliminar contenedores, imágenes y volúmenes
docker-compose down -v
docker system prune -f
docker-compose up --build
```
- ✅ **Seguridad**: Contenedores ejecutados con usuarios no-root
- ✅ **Monitoreo**: Health checks integrados

## 📡 Uso de la API

### Endpoint Principal
```
GET /api/v1/calculate-working-date
```

### Health Check
```
GET /health
```

### Parámetros (Query String)
- `days` (opcional): Número entero positivo de días hábiles a sumar
- `hours` (opcional): Número entero positivo de horas hábiles a sumar  
- `date` (opcional): Fecha inicial en UTC (ISO 8601 con sufijo Z)

**Nota**: Al menos uno de `days` o `hours` debe ser proporcionado.

### Ejemplos de Uso

```bash
# Sumar 2 días hábiles desde ahora
GET /calculate-working-date?days=2

# Sumar 5 horas hábiles desde ahora
GET /calculate-working-date?hours=5

# Sumar 1 día + 3 horas desde una fecha específica
GET /calculate-working-date?days=1&hours=3&date=2025-09-09T20:00:00Z

# Sumar 8 horas laborales
GET /calculate-working-date?hours=8&date=2025-09-08T13:00:00Z
```

### Respuestas

#### Éxito (200 OK)
```json
{
  "date": "2025-09-15T14:00:00.000Z"
}
```

#### Error (400 Bad Request)
```json
{
  "error": "InvalidParameters",
  "message": "At least one of \"days\" or \"hours\" parameter must be provided"
}
```


## 🧪 Ejemplos Detallados

### Ejemplo 1: Viernes 5:00 PM + 1 hora
```bash
GET /api/v1/calculate-working-date?hours=1&date=2025-09-12T22:00:00Z
```
**Resultado**: Lunes 9:00 AM Colombia → `2025-09-15T14:00:00Z`

### Ejemplo 2: Sábado 2:00 PM + 1 hora
```bash
GET /api/v1/calculate-working-date?hours=1&date=2025-09-13T19:00:00Z
```
**Resultado**: Lunes 9:00 AM Colombia → `2025-09-15T14:00:00Z`

### Ejemplo 3: Martes 3:00 PM + 1 día + 3 horas
```bash
GET /api/v1/calculate-working-date?days=1&hours=3&date=2025-09-09T20:00:00Z
```
**Análisis**:
- Martes 3:00 PM + 1 día = Miércoles 3:00 PM
- Miércoles 3:00 PM + 2 horas = Miércoles 5:00 PM (fin del día)
- Queda 1 hora → Jueves 8:00 AM + 1 hora = Jueves 9:00 AM

**Resultado**: Jueves 9:00 AM Colombia → `2025-09-11T14:00:00Z`

## 🏗️ Arquitectura

```
src/
├── index.ts                           # Punto de entrada, servidor Express
├── controllers/
│   └── workingDateController.ts       # Controlador de endpoints REST
├── services/
│   ├── holidayService.ts              # Servicio de gestión de días festivos
│   ├── validationService.ts           # Servicio de validación de parámetros
│   └── workingDateService.ts          # Servicio principal de lógica de negocio
├── utils/
│   └── workingDayCalculator.ts        # Utilidades de cálculo de días hábiles
└── types/
    └── index.ts                       # Interfaces, tipos y constantes
```

### Descripción de la Arquitectura

La aplicación sigue una arquitectura en capas con separación clara de responsabilidades:

#### **Capa de Controladores (Controllers)**
- `workingDateController.ts`: Maneja las peticiones HTTP, extrae parámetros de query y coordina la respuesta

#### **Capa de Servicios (Services)**
- `workingDateService.ts`: Contiene la lógica de negocio principal para el cálculo de fechas laborales
- `validationService.ts`: Valida y transforma los parámetros de entrada
- `holidayService.ts`: Gestiona la carga y consulta de días festivos colombianos

#### **Capa de Utilidades (Utils)**
- `workingDayCalculator.ts`: Contiene los algoritmos core para:
  - Determinar si una fecha es día laboral
  - Ajustar fechas a horarios laborales
  - Sumar días y horas laborales respetando pausas

#### **Capa de Tipos (Types)**
- `index.ts`: Define interfaces TypeScript, tipos de datos y constantes del sistema

### Flujo de Datos

1. **Request** → `workingDateController.ts`
2. **Validación** → `validationService.ts`
3. **Lógica de Negocio** → `workingDateService.ts`
4. **Cálculos** → `workingDayCalculator.ts`
5. **Consulta Festivos** → `holidayService.ts`
6. **Response** → Cliente

Esta arquitectura garantiza:
- ✅ **Separación de responsabilidades**
- ✅ **Fácil testing unitario**
- ✅ **Mantenibilidad y escalabilidad**
- ✅ **Reutilización de código**


## 🚀 Despliegue

### Render
1. Conectar el repositorio a Render
2. La configuración está en `render.yaml`
3. Despliegue automático en cada push a `main`
4. Health checks automáticos en `/health`

### Variables de Entorno
- `PORT`: Puerto del servidor (configurado automáticamente por Render)
- `NODE_ENV`: Entorno de ejecución (configurado como `production`)

## 📚 Tecnologías Utilizadas

- **TypeScript**: Tipado estático
- **Express.js**: Framework web
- **date-fns**: Manipulación de fechas
- **date-fns-tz**: Manejo de zonas horarias

## 🐛 Manejo de Errores

La API maneja los siguientes tipos de errores:

- **400**: Parámetros inválidos o faltantes
- **404**: Endpoint no encontrado  
- **500**: Error interno del servidor
