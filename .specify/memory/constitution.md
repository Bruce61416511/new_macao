<!--
=== Sync Impact Report ===
Version change: [TEMPLATE] → 1.0.0 (MAJOR: initial constitution establishment)
Modified principles: N/A (all principles newly created)
Added sections:
  - I. Spec-First
  - II. Template-Fidelity
  - III. Test-First (NON-NEGOTIABLE)
  - IV. Independent Stories
  - V. Simplicity & YAGNI
  - Development Workflow
  - Quality Gates
  - Governance
Removed sections: None
Templates requiring updates:
  - .specify/templates/plan-template.md: ✓ no changes needed (Constitution Check aligns)
  - .specify/templates/spec-template.md: ✓ no changes needed (scope aligns)
  - .specify/templates/tasks-template.md: ✓ no changes needed (task categorization aligns)
  - .specify/templates/commands/: N/A (directory does not exist)
Follow-up TODOs: None
-->

# codex+deepseek+speckit Constitution

## Core Principles

### I. Spec-First
Every feature MUST begin with a specification document (`spec.md`) that defines user scenarios,
requirements, and acceptance criteria before any implementation work starts. The specification
drives all downstream artifacts: plan, tasks, and implementation. No code is written for a feature
without an approved spec in place.

**Rationale**: Spec-first ensures shared understanding, reduces rework, and provides a single source
of truth for what must be built.

### II. Template-Fidelity
All artifacts (spec, plan, tasks) MUST follow their respective templates in `.specify/templates/`.
Deviations from template structure require explicit justification recorded in the artifact itself.
Template placeholders MUST be fully resolved before an artifact is considered complete.

**Rationale**: Consistent structure enables automated validation, cross-artifact analysis, and
predictable onboarding.

### III. Test-First (NON-NEGOTIABLE)
Test-driven development is mandatory for all feature implementation:
1. Tests are written before implementation code
2. Tests MUST be seen to fail before implementation begins
3. Red-Green-Refactor cycle is strictly enforced
4. Tests are defined per user story to preserve independent testability

**Rationale**: TDD catches design flaws early, ensures test coverage, and prevents regression.

### IV. Independent Stories
Every user story MUST be independently testable and deliverable. A single user story implemented
in isolation MUST produce a viable MVP that delivers value. Cross-story dependencies are explicitly
called out in the plan and minimized. Each story is prioritized (P1, P2, P3...) and can be developed,
tested, deployed, and demonstrated independently.

**Rationale**: Independent stories enable incremental delivery, parallel development, and clear
prioritization of work.

### V. Simplicity & YAGNI
Start with the simplest implementation that satisfies the spec. Avoid premature abstraction,
over-engineering, or speculative features not required by the current specification. Refactor
only when a concrete need emerges from working code. Complexity MUST be justified in the plan.

**Rationale**: YAGNI (You Ain't Gonna Need It) keeps the codebase lean, reduces maintenance burden,
and accelerates delivery.

## Development Workflow

All features follow the Spec Kit pipeline in strict order:

1. **Specify** (`speckit-specify`): Create `spec.md` from a natural language feature description
2. **Clarify** (`speckit-clarify`): Resolve ambiguities with targeted questions
3. **Plan** (`speckit-plan`): Generate `plan.md` with technical context and design decisions
4. **Tasks** (`speckit-tasks`): Generate `tasks.md` with dependency-ordered, actionable tasks
5. **Analyze** (`speckit-analyze`): Run cross-artifact consistency check before implementation
6. **Implement** (`speckit-implement`): Execute tasks in dependency order, validating at checkpoints

Each phase produces a validated artifact that gates the next phase. No phase may be skipped or
reordered without documented justification.

Git operations (branch creation, commits, validation) are handled by the Git extension and triggered
via hooks defined in `.specify/extensions.yml`.

## Quality Gates

The following gates MUST pass before an artifact is considered complete:

- **Spec Gate**: All user stories are prioritized, independently testable, and free of ambiguous
  language. Acceptance criteria are concrete and measurable.
- **Plan Gate**: Technical context is fully resolved (no NEEDS CLARIFICATION markers). Constitution
  principles are referenced and complied with.
- **Tasks Gate**: All tasks are dependency-ordered, labeled by user story, and include exact file
  paths. Parallel opportunities are identified.
- **Analysis Gate**: Cross-artifact consistency check passes with no critical issues. All references
  between spec, plan, and tasks are valid.
- **Implementation Gate**: Tests pass, user stories are independently validated, no regressions
  introduced.

## Governance

This constitution supersedes all other project practices and conventions. All artifacts, code
reviews, and implementation decisions MUST comply with the principles defined herein.

**Amendment Procedure**:
- Proposed amendments MUST be documented with rationale and impact assessment
- Amendments that add principles or sections trigger a MINOR version bump
- Amendments that remove or redefine existing principles trigger a MAJOR version bump
- Clarifications and wording fixes trigger a PATCH version bump

**Compliance Review**:
- Every spec, plan, and tasks artifact is validated against the constitution via `speckit-analyze`
- Deviations from principles MUST be explicitly justified in the relevant artifact
- The constitution is reviewed for relevance at the start of each new feature cycle

**Version**: 1.0.0 | **Ratified**: 2026-05-14 | **Last Amended**: 2026-05-14
