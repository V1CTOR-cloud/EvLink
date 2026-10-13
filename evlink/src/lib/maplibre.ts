import * as maplibregl from "maplibre-gl";

// En Next.js (Turbopack y webpack) esta expresión hace que el bundler emita el
// worker como asset con hash y devuelva su URL. Debe quedar tal cual, con el
// literal y `import.meta.url`, para que el bundler pueda analizarla.
maplibregl.setWorkerUrl(
  new URL("maplibre-gl/dist/maplibre-gl-worker.mjs", import.meta.url).toString(),
);

export { maplibregl };