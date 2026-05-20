# Checks de seguridad

Este repositorio ejecuta checks de seguridad en pull requests para detectar vulnerabilidades de dependencias y credenciales filtradas antes del merge.

## Audit de dependencias

CI ejecuta:

```bash
pnpm audit --audit-level high
```

Política:

- Vulnerabilidades `high` y `critical` bloquean el PR.
- Vulnerabilidades `moderate` se revisan mediante Dependabot y alertas de seguridad, pero no bloquean por defecto.
- No ejecutes `pnpm audit --fix` en CI; modifica archivos de dependencias.

Cómo resolver un fallo de audit:

1. Prioriza actualizar la dependencia directa con `pnpm update <package>` o `pnpm add -D <package>@<version>`.
2. Si el paquete vulnerable es transitivo, usa la sección `overrides` en `pnpm-workspace.yaml` y regenera `pnpm-lock.yaml` con la misma versión de pnpm que usa CI (`pnpm@10`).
3. Si no existe actualización segura, documenta el advisory, exposición, mitigación y follow-up issue en el PR. No ignores advisories en silencio.

## Escaneo de secretos

CI ejecuta TruffleHog sobre el rango de commits del pull request y falla ante secretos probables verificados o desconocidos.

Si se detecta un secreto real:

1. Revoca o rota la credencial inmediatamente.
2. Elimínala de la rama y del historial de commits relevante.
3. Reemplázala por una variable de entorno, GitHub secret o valor local `.env` documentado.

Si el hallazgo es un falso positivo:

1. Explica por qué es seguro en el PR.
2. Prioriza reemplazar el valor por un placeholder claramente falso, como `example-token-not-real`.
3. Solo agrega una allowlist estrecha cuando el valor deba permanecer en el repositorio.

## Dependabot

`.github/dependabot.yml` habilita PRs semanales de actualización para dependencias npm y GitHub Actions.

Los maintainers también deben confirmar que estos settings de GitHub estén activos:

- Dependency graph
- Dependabot alerts
- Dependabot security updates
