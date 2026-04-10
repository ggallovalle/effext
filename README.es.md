# effext

```
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║                     effext                                    ║
║   Extensiones para Effect — libreria standard explorada       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

> Extensiones para Effect — explorando lo que pertenece a la libreria estándar.

[![License: MIT](https://img.shields.io/badge/License-MIT-darkgreen.svg)](./LICENSE)
[![Bun version](https://img.shields.io/badge/Bun-%E2%89%A5+1.3.0-yellow.svg)](https://bun.sh)
[![Node version](https://img.shields.io/badge/Node-%E2%89%A522+-green.svg)](https://nodejs.org)

**[English](./README.md)** | **[Español](./README.es.md)**

---

## Tabla de Contenidos

- [Acerca de](#acerca-de)
- [Estado](#estado)
- [Módulos](#módulos)
- [Principios de Diseño](#principios-de-diseño)

---

## Acerca de

**effext** es una colección de módulos construidos sobre [Effect](https://effect.website/), enfocados en capacidades que son comúnmente necesarias en aplicaciones reales pero que no son parte de la libreria central.

El objetivo es simple:

- Construir módulos útiles y orientados a producción usando patrones idiomáticos de Effect
- Validarlos a través del uso real
- Y, donde tenga sentido, contribuirlos upstream

> No es un reemplazo para Effect — un campo de pruebas para lo que podría convertirse en parte de él.

---

## Estado

Este proyecto actualmente está en la **fase de planificación**.
Los siguientes módulos están planeados, pero aún no implementados:

```ts
import {
    ConfigLayered,
    ConfigYaml,
    ConfigJsonc,
    I18n,
    // y mas
} from "@kbroom/effext";
// o
import * as I18n from "@kbroom/effext/I18n";
import * as ConfigLayered from "@kbroom/effext/ConfigLayered";
// y mas
```

---

## Módulos

### Internacionalización

| Módulo         | Descripción                    |
| -------------- | ------------------------------ |
| **I18n**       | Abstracciones base             |
| **I18nFluent** | Integración con Mozilla Fluent |

### Diagnósticos y Experiencia de Desarrollo

| Módulo     | Descripción                                                             |
| ---------- | ----------------------------------------------------------------------- |
| **Miette** | Diagnósticos de errores de forma structurada (inspirado en Rust miette) |

### Sistema

| Módulo  | Descripción                                |
| ------- | ------------------------------------------ |
| **Xdg** | Acceso a las rutas del directorio base XDG |

### Configuración

| Módulo            | Descripción                                             |
| ----------------- | ------------------------------------------------------- |
| **ConfigLayered** | Sistema de configuración por capas (estilo cosmiconfig) |
| **ConfigYaml**    | Cargador de configuración YAML con diagnósticos ricos   |
| **ConfigJsonc**   | Cargador de configuración JSONC con diagnósticos ricos  |
| **ConfigKdl**     | Cargador de configuración KDL con diagnósticos ricos    |

### Salida de Terminal

| Módulo   | Descripción                                 |
| -------- | ------------------------------------------- |
| **Echo** | Utilidades de salida de terminal expresivas |

---

## Principios de Diseño

- **Effect-first** — Construido usando los mismos patrones y abstracciones que Effect
- **Composable** — Piezas pequeñas que funcionan bien juntas
- **Pragmático** — Enfocado en necesidades del mundo real, no solo pureza teórica
- **Amigable para upstream** — Diseñado con posible inclusión en Effect en mente
