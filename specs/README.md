# specs/

Spec detallada por feature, estilo Kiro. Se crea bajo demanda con `/feature:start <id>` (nunca a mano) cuando una entrada de `feature_list.json` pasa de `backlog` a `in-progress`.

```
specs/<feature-id>/
├── requirements.md   # notación EARS: "CUANDO <disparador> EL SISTEMA DEBERÁ <respuesta>"
├── design.md         # decisiones técnicas de ESTA feature: archivos a tocar, modelo de datos, componentes/rutas, edge cases
└── tasks.md          # checklist ordenado de implementación ("- [ ]" / "- [x]")
```

## Quién lee/escribe cada archivo

| Archivo | Escribe | Lee |
|---|---|---|
| `requirements.md` | orchestrator (al crear la spec) | implementer, reviewer |
| `design.md` | orchestrator (borrador), implementer (ajustes menores) | implementer, reviewer |
| `tasks.md` | orchestrator (borrador inicial), implementer (marca checklist) | orchestrator, reviewer |

`requirements.md` es la fuente de verdad de criterios de aceptación detallados para una feature activa — más específica que el resumen en `feature_list.json`.
