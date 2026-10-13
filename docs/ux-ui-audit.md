# Auditoría UX/UI de EvLink

## A. Resumen ejecutivo

La aplicación cuenta con una identidad visual compartida, componentes shadcn/ui, tokens para tema claro/oscuro y patrones útiles de carga, error, formularios y listados. La auditoría confirmó un problema P1 de contraste en el texto de botones/chips primarios del tema claro: `#f9f9f9` sobre `#2ed452` ofrece 1.87:1, por debajo del mínimo WCAG AA de 4.5:1 para texto normal. El foreground oscuro `#07100a` ofrece 9.8:1. El build y TypeScript pasan, y las pruebas existentes pasan (25 pruebas).

La auditoría inicial no encontró problemas P0/P1 en las pantallas revisadas. Los hallazgos de mayor impacto se concentran en accesibilidad de navegación en tablas, landmarks principales anidados, retroalimentación de validación y recuperación de errores. Se identificó además un fallo de lint en la sincronización de filtros de las listas de pagos y sesiones.

El dashboard ya presenta métricas y gráficos a partir de datos del producto; esta auditoría no propone cambiar sus cálculos ni las reglas de negocio. El trabajo restante consiste en mejorar accesibilidad y recuperación, hacer más precisos los estados y copy, y resolver los problemas de lint sin cambiar la semántica de filtros.

## B. Inventario de pantallas

| Ruta | Pantalla / componentes principales | Hallazgos iniciales | Prioridad | Estado |
|---|---|---|---|---|
| `/` | Dashboard de usuario, resumen de actividad | Landmark principal anidado; saludo no depende de la hora | P2/P3 | En revisión |
| `/login`, `/register` | Formularios de autenticación | Validación solo mediante toast, sin errores asociados a campos | P2 | En revisión |
| `/account-disabled` | Cuenta deshabilitada | Mensaje de acceso y acción de cierre de sesión claros; feedback de error/loading presente | — | Revisada |
| `/stations` | Explorador, filtros, mapa y lista | Placeholder de mapa sin estado anunciado | P3 | En revisión |
| `/stations/[id]` | Detalle de estación y conectores | Conector disponible deshabilitado para visitantes sin explicación ni acceso a login | P2 | En revisión |
| `/sessions`, `/sessions/[id]` | Historial y detalle de sesiones | Listado con estados vacíos/carga/error y controles etiquetados; sin duplicación de toasts observada | — | Revisada |
| `/profile` | Información de perfil y métodos de pago | Landmark anidado; carga sin anuncio; error sin acción de recuperación | P2 | En revisión |
| `/admin` | Dashboard y gráficos de administración | Landmark anidado | P2 | En revisión |
| `/admin/stations`, `/admin/stations/new`, `/admin/stations/[id]`, `/admin/stations/[id]/edit` | Listado, alta, detalle y edición de estaciones/conectores | Formularios y navegación con patrones reutilizables; sin problema P0/P1 confirmado | — | Revisadas |
| `/admin/users`, `/admin/users/[id]` | Listado y detalle de usuarios | Listados responsivos y formularios con asociación de errores observada | — | Revisadas |
| `/admin/sessions`, `/admin/sessions/[id]` | Listado y detalle de sesiones administrativas | Filtros de lista relacionados con errores de lint | P2 | En revisión |
| `/admin/payments`, `/admin/payments/[id]` | Listado y detalle de pagos | Enlace de detalle no accesible por teclado en tabla; copy de enlace impreciso; estado de sesión sin traducir | P2 | En revisión |

Las rutas se verificaron en el árbol real de `src/app` y en la compilación de producción. Los conectores se administran desde el detalle de estaciones, no desde una ruta independiente.

## C. Hallazgos detallados

| ID | Archivo/componente | Problema e impacto | Causa / solución | Prioridad | Estado |
|---|---|---|---|---|---|
| UX-01 | `src/components/admin/AdminPaymentsList.tsx` | El acceso al detalle de pago en la tabla de escritorio queda fuera del orden de tabulación y oculto a tecnologías de asistencia; el texto accesible también lo llama “sesión”. | Link configurado con `tabIndex={-1}` y `aria-hidden`; mantener el enlace enfocable y nombrarlo como detalle de pago. | P2 | Corregido |
| UX-02 | `src/app/admin/layout.tsx`, `src/components/admin/dashboard/AdminDashboard.tsx`, `src/app/(dashboard)/layout.tsx`, páginas `/` y `/profile` | Algunos contenidos tienen `<main>` dentro del landmark `<main>` del layout, lo que dificulta la navegación por landmarks. | La responsabilidad del landmark está duplicada entre layout y página; dejar un único `<main>` por pantalla. | P2 | Corregido |
| UX-03 | `src/components/login/LoginForm.tsx`, `src/components/register/RegisterForm.tsx` | Los errores de validación aparecen como toast, pero no se muestran junto al campo que debe corregirse. | La validación reporta el primer error sin renderizar ni asociar errores por campo; añadir mensajes inline accesibles, manteniendo el feedback operativo apropiado. | P2 | Corregido |
| UX-04 | `src/app/(dashboard)/profile/page.tsx`, `src/hooks/useProfile.ts` | Si falla la carga del perfil, el usuario ve un mensaje sin una acción para recuperarse. | El estado de error carece de retry o siguiente paso; agregar recuperación sin ocultar el error. | P2 | Corregido |
| UX-05 | `src/components/stations/StationConnectorsCard.tsx` | Visitantes sin sesión ven conectores disponibles deshabilitados, pero no se explica la restricción ni se ofrece iniciar sesión. | El control usa `disabled` para usuarios anónimos sin contexto; explicar el requisito y ofrecer acceso a login sin iniciar una carga. | P2 | Corregido |
| UX-06 | `src/components/search/GlobalSearch.tsx`, `src/config/routes.ts` | La ruta `/profile` está registrada, pero no incluida en las rutas buscables. | La lista permitida de búsqueda está incompleta; agregar el destino existente. | P2 | Corregido |
| UX-07 | `src/components/admin/payments/AdminPaymentDetail.tsx`, `src/lib/session-utils.ts` | El estado de la sesión asociada se presenta como el enum crudo, a diferencia del estado de pago traducido. | Faltaba usar la representación localizada; se reutiliza el mapeo compartido con fallback para estados futuros. | P2 | Corregido |
| UX-08 | `src/app/admin/loading.tsx` | El fallback compartido de administración anuncia específicamente que carga el dashboard incluso al navegar a otras secciones. | El loading de nivel admin usaba copy y skeleton exclusivos del dashboard; se reemplazó por una estructura genérica y se anunció el estado. | P3 | Corregido |
| UX-09 | `src/components/dashboard/DashboardHeader.tsx` | El saludo “Buenos días” no corresponde a la hora actual en buena parte del día. | Texto constante; se cambió por un saludo neutro. | P3 | Corregido |
| UX-10 | `src/components/stations/StationsExplorer.tsx` | El placeholder del mapa durante la carga es un bloque visual animado sin estado accesible. | El fallback no comunicaba el estado a lectores de pantalla; se añadió estado anunciado. | P3 | Corregido |
| UX-11 | `src/app/(dashboard)/stations/error.tsx` | El mensaje plural de error de estaciones también puede mostrarse en un fallo de detalle. | El boundary de segmento cubre la ruta anidada; se generalizó el mensaje sin ocultar el error. | P3 | Corregido |
| UX-12 | `src/app/(dashboard)/profile/page.tsx` | El estado de carga de perfil no está marcado como estado para tecnologías de asistencia. | Texto visual sin región/rol de estado; ahora se anuncia la carga. | P3 | Corregido |
| UX-13 | `src/components/admin/AdminPaymentsList.tsx`, `src/components/admin/AdminSessionsList.tsx` | ESLint rechaza la sincronización síncrona de estado en efectos al cambiar los parámetros de filtros; además puede producir renderizados redundantes. | Se usa sincronización condicional al recibir cambios de URL en pagos; sesiones conserva el `key` que ya tenía en el padre. | P2 | Corregido |
| UX-14 | `src/app/globals.css` | Texto casi blanco sobre el fondo primario verde tiene contraste 1.87:1, por lo que etiquetas y botones primarios del tema claro son difíciles de leer. | `--primary-foreground` era demasiado claro para `--primary`; se cambió a foreground oscuro, con contraste 9.8:1. | P1 | Corregido |

### Cobertura de errores observada

Las páginas administrativas de pagos no gestionan localmente el error de consulta; el layout administrativo dispone de un error boundary de segmento. No se recomienda duplicar mensajes inline y boundary sin una necesidad funcional concreta. La página de sesiones de usuario sí ofrece estados de carga, error, lista vacía y resultado filtrado vacío.

## D. Sistema visual resultante

- **Tokens:** `src/app/globals.css` define colores semánticos para fondo, texto, card, popover, primary, secondary, muted, accent, destructive, border, input, ring, sidebar y gráficas; existen valores para tema claro y oscuro.
- **Colores:** usar `primary` para acción/marca, `muted` para superficies secundarias y `destructive` para errores y acciones peligrosas. Evitar asignar significado a un color sin texto o iconografía complementaria.
- **Estados/chips:** usar etiquetas textuales junto con el color y reutilizar las representaciones por dominio; no mostrar enums de base de datos sin traducir.
- **Tipografía/espaciado:** Inter y Geist Mono están configuradas globalmente; los componentes UI proporcionan escalas compartidas de tarjetas, campos y botones.
- **Controles:** Button, Input, Field, Badge y Card proveen variantes compartidas con foco visible y tema semántico.
- **Feedback:** Sonner tiene una única instancia global con iconos de estado. Mantener errores de validación y de página junto a su contexto; reservar toast para resultados transitorios de operaciones.
- **Carga y vacíos:** las listas de estaciones/sesiones incluyen varios estados explícitos; evitar que fallback de carga específico de dashboard se reutilice para otras secciones.

No se propone una paleta, tipografía ni sistema de componentes alternativo.

## E. Cambios realizados

Cambios aplicados:

- **Refactorización compartida:** se reutiliza `sessionStatusLabels`; se retira la sincronización de filtros desde efectos que causaba errores de lint.
- **Corrección visual:** contraste del texto primario en tema claro; saludo del dashboard y fallback genérico de carga administrativa.
- **Corrección de usabilidad:** acceso desde búsqueda al perfil, CTA de login en conectores y acción de retry al cargar el perfil.
- **Corrección de accesibilidad:** enlaces de pagos tabulables y correctamente nombrados, errores inline asociados a inputs y estados de carga anunciados; se evita anidar landmarks principales.
- **Corrección funcional:** los filtros conservan su estado al navegar por la URL; el retry vuelve a ejecutar la consulta del perfil.
- **Seguridad/reglas de negocio:** no se modificaron autorización, RLS, pagos ni el inicio de carga.

Archivos modificados:

- `src/app/globals.css`
- `src/app/(dashboard)/page.tsx`
- `src/app/(dashboard)/profile/page.tsx`
- `src/app/(dashboard)/stations/error.tsx`
- `src/app/admin/loading.tsx`
- `src/app/admin/payments/page.tsx`
- `src/components/admin/AdminPaymentsList.tsx`
- `src/components/admin/AdminSessionsList.tsx`
- `src/components/admin/dashboard/AdminDashboard.tsx`
- `src/components/admin/payments/AdminPaymentDetail.tsx`
- `src/components/dashboard/DashboardHeader.tsx`
- `src/components/login/LoginForm.tsx`
- `src/components/register/RegisterForm.tsx`
- `src/components/search/GlobalSearch.tsx`
- `src/components/stations/StationConnectorsCard.tsx`
- `src/components/stations/StationsExplorer.tsx`
- `src/hooks/useProfile.ts`
- `docs/ux-ui-audit.md`

## F. Validación

Validación ejecutada:

| Comando | Resultado |
|---|---|
| `npm run lint` | Baseline: 4 errores `react-hooks/set-state-in-effect` en filtros de `AdminPaymentsList.tsx` y `AdminSessionsList.tsx`, 2 warnings de imports sin usar. Tras los cambios: 0 errores y 1 warning preexistente (`CommandItem` en `GlobalSearchResults.tsx`). |
| `npx tsc --noEmit` | Correcto tras los cambios. |
| `npm run test:run` | Correcto: 6 archivos, 25 pruebas. |
| `npm run build` | El baseline pasó. No se repitió tras los cambios porque ya había un servidor Next.js ajeno a esta ejecución en `localhost:3000`; no se interrumpió ni se arriesgó a corromper su salida `.next`. |
| Navegador | Verificado `/login` a 390×844 en claro y oscuro; el envío vacío muestra errores inline asociados a los campos. No se inspeccionaron visualmente rutas protegidas. |

Los resultados posteriores a las correcciones se añadirán al cerrar la fase de validación.

## G. Lista de cierre

- [x] Mantener accesibles por teclado los enlaces de detalle y nombrarlos correctamente.
- [x] Eliminar landmarks principales anidados en las pantallas auditadas.
- [x] Mostrar y asociar accesiblemente los errores de validación de autenticación.
- [x] Proporcionar recuperación del error al cargar perfil.
- [x] Explicar el acceso requerido para seleccionar un conector a visitantes.
- [x] Completar la búsqueda con las rutas registradas.
- [x] Localizar estados de sesión mostrados en pagos.
- [x] Hacer neutrales los estados de carga compartidos y accesibles los fallbacks del mapa/perfil.
- [x] Corregir los filtros sin duplicar estado derivado de URL.
- [x] Corregir el contraste insuficiente del foreground primario.
- [x] Ejecutar TypeScript, lint y pruebas; el lint conserva un warning preexistente en `GlobalSearchResults.tsx`.
- [ ] Repetir build de producción cuando no haya un servidor de desarrollo usando `.next`.
- [ ] Revisar visualmente las rutas protegidas con una sesión admin/usuario válida, también en tema oscuro y viewports adicionales.
