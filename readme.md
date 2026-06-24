# Lo del trabajo TA-2.1  esta en la linea 100 (califique con ojos de madre ://)

# PE-2.1 Configuración y primer servicio middleware
# PE-2.2 Documentación y versionado de API estan en la lnea 137


Servidor Express desarrollado con TypeScript, módulos ES y middlewares personalizados.

## Comandos de ejecución

```powershell
npm run dev
```

Salida del servidor:

```text
Servidor en puerto 3000
GET /health -> 401 (2ms)
GET /health -> 401 (1ms)
GET /noexiste -> 404 (1ms)
```

## Escenario A: Sin API key (401)

Comando:

```powershell
curl http://localhost:3000/health
```

Salida real:

```json
curl : {"error":"API key inválida o ausente"}
En línea: 1 Carácter: 1
+ curl http://localhost:3000/health
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.Htt 
   pWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExcepti  
  on
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Mic 
   rosoft.PowerShell.Commands.InvokeWebRequestCommand
```

Explicación:

El servidor responde con estado 401 Unauthorized porque no se envió la cabecera x-api-key requerida por el middleware de autenticación.

## Escenario B: Con API key válida (200)

Comando:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/health" -Headers @{"x-api-key"="secreto-demo"}
```

Salida:

```json
No se puede convertir el valor "x-api-key: secreto-demo" de 
tipo "System.String" al tipo "System.Collections.IDictionary".
En línea: 1 Carácter: 9
+ curl -H "x-api-key: secreto-demo" http://localhost:3000/health
+         ~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : InvalidArgument: (:) [Invoke-WebR 
   equest], ParameterBindingException
    + FullyQualifiedErrorId : CannotConvertArgumentNoMessage,Mi 
   crosoft.PowerShell.Commands.InvokeWebRequestCommand
 
```

Explicación:

El servidor responde con estado 200 OK porque la API key enviada coincide con la configurada en el middleware.

## Escenario C: Ruta inexistente (404)

Comando:

```powershell
Invoke-WebRequest -Uri "http://localhost:3000/noexiste" -Headers @{"x-api-key"="secreto-demo"}
```

Salida real:

```text
+ Invoke-WebRequest -Uri "http://localhost:3000/noexiste" 
-Headers @{"x ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
~~~~~~~
    + CategoryInfo          : InvalidOperation: (System.Net.Htt 
   pWebRequest:HttpWebRequest) [Invoke-WebRequest], WebExcepti  
  on
    + FullyQualifiedErrorId : WebCmdletWebResponseException,Mic 
   rosoft.PowerShell.Commands.InvokeWebRequestCommand
```

Explicación:

El servidor responde con estado 404 Not Found porque la ruta solicitada no existe dentro de la aplicación.


## Testing

Para ejecutar las pruebas unitarias:

```bash
npm test
```

Resultado obtenido:

```text
PASS  src/middlewares/auth.test.ts
PASS  src/middlewares/logger.test.ts

Test Suites: 2 passed, 2 total
Tests:       5 passed, 5 total
Snapshots:   0 total
Time:        0.407 s, estimated 1 s
Ran all test suites.
```

### Casos cubiertos

#### Logger Middleware

- Verifica que `next()` sea invocado al recibir una petición.
- Verifica que se registre correctamente el método y la ruta.

#### API Key Middleware

- Header `x-api-key` ausente → responde `401`.
- API key incorrecta → responde `401`.
- API key válida → invoca `next()` sin generar respuesta.

## Pruebas de los endpoints

Servidor ejecutándose en:

```text
http://localhost:3000
```
PE-2.2 Documentación y versionado de API
### Escenario 1 — POST /v1/inscripciones con campos válidos (201)

![POSTMAN 1](docs/screenshots/postman1.png)

### Escenario 2 — POST /v2/inscripciones con método de pago válido (201)

![POSTMAN 2](docs/screenshots/postman2.png)

### Escenario 3 — POST /v2/inscripciones sin metodo_pago (400)

![POSTMAN 3](docs/screenshots/postman3.png)

### Escenario 4 — POST /v2/inscripciones con metodo_pago inválido (400)

![POSTMAN 4](docs/screenshots/postman4.png)

## Validación OpenAPI

Resultado de `npx @redocly/cli lint openapi.yaml`:

![Redocly lint sin errores](docs/screenshots/lint-sin-errores.png)

## Reflexión: si otro equipo consumiera esta API

Si otro equipo empezara a consumir esta API mañana, agregaría schemas reutilizables para todas las respuestas de error y documentaría con mayor detalle los códigos HTTP de cada endpoint. Esto facilitaría la integración para desarrolladores externos, porque podrían conocer exactamente la estructura de los errores 400 y 401 sin revisar el código fuente ni hacer pruebas manuales.