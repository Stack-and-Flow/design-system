# Component cataloging and V1 recatalogation handoff

This guide defines how to classify components during MVP and how to hand recatalogation to V1. Short answer: **MVP PRs may merge in their current location when they meet the quality bar; full recatalogation belongs to V1**.

---

## Quick path

1. Validate the MVP quality bar first: TypeScript, tests or justification, reasonable Storybook coverage, accessibility basics, token usage without major drift, and no known functional blocker.
2. Classify the component with the `primitives`, `atoms`, `molecules`, and `organisms` contracts in this guide.
3. If the current location does not match the classification, document it as a V1 follow-up; do not mix it into the MVP PR unless required for MVP quality.
4. Create child issues only from validated cataloging decisions with enough evidence.
5. After MVP, follow the V1 sequence: #223 → #224 → #225 → #226 → #227.

---

## MVP merge rule vs V1 boundary

| Topic | Decision |
| --- | --- |
| MVP merge | An MVP component may merge where it is if it meets the current quality bar. |
| MVP quality bar | TypeScript passes; tests exist or their absence is justified; Storybook covers meaningful states/variants; accessibility basics are covered; token usage has no major drift; no known functional blocker remains. |
| Catalog mismatch | The difference between the current location and target tier is documented as V1 follow-up work. |
| V1 work | Do not mix it into MVP PRs unless the change is required to meet MVP quality. |
| Handoff | This guide is the final criteria and contract handoff before #223; no “issue 0” is needed. |

> If recatalogation changes imports, exports, stories, or structure without unlocking MVP quality, it is V1.

---

## Operational workflow

### During MVP

- Validate the MVP quality bar before recataloging.
- Classify the component with this guide and leave any current-location mismatch as a V1 follow-up.
- Do not move or split components unless required to meet MVP quality.

### Handoff after MVP / before #223

- Use this guide as the criteria source for V1 recatalogation.
- Do not create an “issue 0”: #223 starts directly from these contracts and checklist.

### #223 inventory

Inspect every MVP component and record:

- current path/tier;
- proposed V1 tier;
- decision: `reuse existing`, `keep in parent`, `split/extract`, `needs child issue`, or `defer to V1 inventory`;
- evidence against the MVP bar and tier contract;
- migration impact: imports, exports, stories, docs, and tests;
- whether a validated child issue is needed.

### Child issues

- For proposed specs, use `skills/component-spec-cataloging-validator/SKILL.md` before approving `## Validated component spec`; before approval it must produce `## Draft cataloging decision` or `## Cataloging blockers/questions`.
- Create or reuse child issues only after a final validated `## Cataloging decision`, placed immediately after `## Validated component spec` in the same comment/update and without unresolved blockers/questions.
- Use them for `primitive`, `atom`, `molecule`, or `organism` candidates that can be reviewed independently.
- Extracted lower-tier pieces are usually `primitive`, `atom`, or `molecule`; an `organism` may also have a child issue when the validated decision marks it as independently reviewable scope.
- If `Child issue candidates` is `yes`, the `### Child issue candidates` block is the handoff consumed by `component-child-issues`.
- Link parent/child and update the cataloging checklist.
- `skills/component-child-issues/SKILL.md` can help execute this part without skipping the gate.

### Recatalogation PRs

- Keep each PR reviewable: prefer one independent piece or a small, closely related set.
- Keep docs, stories, tests, and exports with the unit that changes.
- Use #224/#225 for moves/splits, #226 for public surface and docs migration, and #227 for final verification.

### Blocking rule

If the decision is not validated or evidence is missing, do not create child issues. Record the finding in #223 first.

---

## Tier contracts

| Tier | Contract | May depend on | Must not do |
| --- | --- | --- | --- |
| `primitives` | Native design-system unit at the HTML/ARIA level: base element, slot, wrapper, or minimal behavior that preserves native semantics. | Tokens, shared utilities, HTML/ARIA attributes, and minimal accessibility hooks. | Compose product concepts, impose copy, coordinate several controls, or represent a business pattern. |
| `atoms` | One semantic UI concept. It may use up to two supporting sub-`primitives` when that keeps the API simple. | `primitives`, tokens, simple CVA/variants, limited local state. | Orchestrate several peer concepts, expose complex layout, contain flows, coordinate lists, or create contextual composition. |
| `molecules` | Small composition of several UI concepts that work together as a reusable unit. | `atoms`, `primitives`, interaction hooks, and local layout. | Represent a full page section, own high-level navigation, or absorb extensive domain logic. |
| `organisms` | Large composed block: section, region, or interface pattern with several molecules/atoms and a clear structural responsibility. | `molecules`, `atoms`, `primitives`, and sample data for stories. | Become a full page, mix non-reusable application rules, or hide smaller components that should be extracted. |

### Operational definitions

- `Primitive` means native HTML/ARIA-level design-system unit.
- `Atom` means one semantic UI concept; it may rely on at most two supporting sub-`primitives`.
- `split/extract` means the proposal must be conceptually divided or extracted before final implementation is decided.
- `needs child issue` means at least one extracted or reused unit is independently reviewable and should be tracked separately.
- Candidate tier groupings are examples, not automatic targets. V1 recatalogation must dissect complex current molecules/organisms into smaller reusable `primitives`, `atoms`, and `molecules` when appropriate.

---

## Split and recatalogation criteria

Use this table to decide whether to keep, move, or split.

| Signal | Suggested decision |
| --- | --- |
| One UI concept, small API, simple local state | Candidate `atom`. |
| Reusable native wrapper without its own visual concept | Candidate `primitive`. |
| Two or more coordinated UI concepts | Candidate `molecule`. |
| Full region with hierarchy, composition, and structural responsibility | Candidate `organism`. |
| Variants change component semantics, not only styling | Evaluate a split before classifying. |
| Props enable mutually exclusive behaviors | Evaluate separate components. |
| Storybook needs many stories to explain unrelated uses | Likely split. |
| Tests cover independent flows inside the same component | Likely split. |
| Current component only exists for one page layout | Keep outside the catalog or treat as a specific `organism` if reusable. |

---

## Automatic disqualifiers for `atom`

A component **must not** be classified as an `atom` if any of these conditions apply:

- It coordinates three or more semantic subparts.
- It exposes multiple slots or regions with independent responsibilities.
- It contains a list, collection, menu, table, wizard, field group, or composite navigation.
- It requires shared state across subcomponents to work.
- It has variants that change the full interaction pattern.
- It needs more than two sub-`primitives` to support its contract.
- Its documentation must explain several unrelated use cases.
- Its API mixes layout, content, interaction, and presentation in one component.

If a disqualifier appears, classify it as `molecule`/`organism` or split before deciding.

---

## Classification checklist for reviewers

Copy this template into the issue, PR, or review comment only for a final/approved catalog decision. Before approval, use `## Draft cataloging decision` or `## Cataloging blockers/questions` instead.

```md
## Cataloging decision

- Component:
- Proposed tier: primitive | atom | molecule | organism
- Current/proposed path:
- Decision: reuse existing | keep in parent | split/extract | needs child issue | defer to V1 inventory
- Existing pieces to reuse:
- Pieces to extract/create:
- Child issue candidates: yes | no
- Target issue: parent | #223 | #224 | #225 | #226 | #227
- Blockers/questions: none

### Child issue candidates

If `Child issue candidates` is `yes`, this section is the deterministic handoff consumed later by `component-child-issues`. Include one row per candidate with blockers/questions resolved as `none`; use `none` across the row only when candidates are `no`. Any unresolved blocker or question belongs in `## Cataloging blockers/questions` or the draft state, not in the final decision.

| Candidate name | Proposed tier | Source/parent component | Action | Reuse target or extraction reason | Scope summary | Target issue | Blockers/questions |
| --- | --- | --- | --- | --- | --- | --- | --- |
| {name or none} | primitive/atom/molecule/organism | {source component} | reuse existing/create new/skip/defer | {existing component or why this must be extracted} | {independently reviewable scope} | parent/#223/#224/#225/#226/#227 | none |

### Evidence

- Tier contract check:
- Existing catalog check:
- Reuse/extraction rationale:
```

---

## Child issues: only from validated decisions

Do not create child issues from intuition or shallow inventory. A recatalogation child issue must come from a validated `## Cataloging decision`, adjacent to `## Validated component spec` in the same comment/update, that includes:

- affected component or group;
- current tier and target tier;
- evidence of the unmet contract or required split;
- expected impact on imports, exports, Storybook, docs, or tests;
- target V1 issue;
- per candidate: name, proposed tier, source/parent component, action, reuse target or extraction reason, scope summary, target issue, and blockers/questions.

If that evidence is missing, record the observation in #223 first.

---

## V1 sequence

| Order | Issue | Expected outcome |
| --- | --- | --- |
| 1 | [#223](https://github.com/Stack-and-Flow/design-system/issues/223) | Complete inventory and validated target taxonomy. |
| 2 | [#224](https://github.com/Stack-and-Flow/design-system/issues/224) | `primitives` and `atoms` recatalogation. |
| 3 | [#225](https://github.com/Stack-and-Flow/design-system/issues/225) | `molecules` and `organisms` recatalogation. |
| 4 | [#226](https://github.com/Stack-and-Flow/design-system/issues/226) | Exports, Storybook, and docs migration. |
| 5 | [#227](https://github.com/Stack-and-Flow/design-system/issues/227) | Final verification of catalog, imports, docs, and coverage. |

Keep the sequence: validate the map first, then move/split, then migrate public surfaces, and finally verify.
