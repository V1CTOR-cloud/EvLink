
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

const packagePath = require.resolve("maplibre-gl/package.json");
const distPath = path.join(path.dirname(packagePath), "dist");
const destinationPath = path.join(
  process.cwd(),
  "public",
  "maplibre",
);

mkdirSync(destinationPath, { recursive: true });

for (const file of [
  "maplibre-gl-worker.mjs",
  "maplibre-gl-shared.mjs",
]) {
  copyFileSync(
    path.join(distPath, file),
    path.join(destinationPath, file),
  );
}

console.log("MapLibre workers copiados correctamente.");
