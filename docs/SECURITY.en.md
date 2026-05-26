# Security checks

This repository runs security checks on pull requests so dependency vulnerabilities and leaked credentials are caught before merge.

## Dependency audit

CI runs:

```bash
pnpm audit --audit-level high
```

Policy:

- `high` and `critical` vulnerabilities block the PR.
- `moderate` vulnerabilities are reviewed through Dependabot and security alerts, but are not blocking by default.
- Do not run `pnpm audit --fix` in CI; it mutates dependency files.

How to fix a dependency audit failure:

1. Prefer updating the direct dependency with `pnpm update <package>` or `pnpm add -D <package>@<version>`.
2. If the vulnerable package is transitive, use the `overrides` section in `pnpm-workspace.yaml` and regenerate `pnpm-lock.yaml` with the same pnpm version used in CI (`pnpm@10`).
3. If no safe upgrade exists, document the advisory, exposure, mitigation, and follow-up issue in the PR. Do not ignore advisories silently.

## Secrets scan

CI runs a TruffleHog scan on the pull request commit range and fails on verified or unknown probable secrets.

If a real secret is detected:

1. Revoke or rotate the credential immediately.
2. Remove it from the branch and any relevant commit history.
3. Replace it with an environment variable, GitHub secret, or documented local `.env` value.

If the scan is a false positive:

1. Explain why it is safe in the PR.
2. Prefer replacing the value with an obvious fake placeholder such as `example-token-not-real`.
3. Only add a narrow allowlist when the value must remain in the repository.

## Dependabot

`.github/dependabot.yml` enables weekly update PRs for npm dependencies and GitHub Actions.

Repository maintainers should also confirm these GitHub settings are enabled:

- Dependency graph
- Dependabot alerts
- Dependabot security updates
