# Convenciones

## Código

- TypeScript en modo estricto.
- Alias de imports `@/*` apuntando a `src/*`.
- Componentes función (no clases). Un componente por archivo, nombre de archivo en PascalCase para componentes, camelCase para utilidades/hooks/servicios.
- Copy de UI en español (idioma del usuario); identificadores de código (variables, funciones, tipos) en inglés.
- Sin abstracciones prematuras: no crear una capa/hook/helper hasta que haya al menos 2-3 usos reales.

## Tests

- Centralizados en `src/__tests__/`, espejando la estructura de `src/` (`src/__tests__/components/...`, `src/__tests__/services/...`, `src/__tests__/app/...`).
- Nombre de archivo: `*.test.ts` / `*.test.tsx`.
- Stack previsto: `jest-expo` + React Native Testing Library (se instala en `f-000-project-bootstrap`).
- Toda feature con lógica de negocio (servicios, transformaciones de datos) lleva test; pantallas puramente presentacionales son opcionales salvo interacción compleja.

## Flujo de features

- Ninguna feature se marca `done` en `feature_list.json` sin que su `specs/<id>/tasks.md` esté completo y haya pasado por el subagente `reviewer` contra `specs/<id>/requirements.md`.
- Los criterios de aceptación de una feature en curso son los de `specs/<id>/requirements.md` (EARS), no solo los de `feature_list.json` (que son un resumen de alto nivel).

## Testing gotcha (RNTL 14 / test-renderer)

`@testing-library/react-native` 14.x usa el nuevo paquete `test-renderer` (reemplazo de `react-test-renderer`, retirado en React 19) y su `render()` es **asíncrono**: siempre `await render(...)` (y `await` en `rerender`), si no el resultado llega vacío sin lanzar error claro.

## Skills de referencia

Para patrones de UI/animaciones/arquitectura React Native, usar las skills globales ya instaladas: `building-native-ui`, `react-native-architecture`, `react-native-best-practices`, `react-native-design`, `react-native-animations`, `vercel-react-native-skills`. No duplicar su contenido aquí.
