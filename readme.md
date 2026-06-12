# PE-2.1 Configuración y primer servicio middleware

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

## Verificación de compilación

Comando:

```powershell
npx tsc --noEmit
```

Resultado:

La compilación finaliza sin errores, verificando que el proyecto cumple con el tipado estricto de TypeScript.
