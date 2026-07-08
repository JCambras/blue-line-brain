# Project agent memory

This file is the project's committed home for project-intrinsic agent knowledge: build, test, release, architecture, and sharp-edge notes that should travel with the code.

- Scenario content (quiz questions + rink animations) lives in `src/data/scenarios/*.ts`; the authoring contract, including puck placement rules, is `src/data/scenarios/AUTHORING.md`. Mechanical invariants are enforced by `npm run validate` (also part of `npm run build`).
- The rink renderer draws a carried puck on the carrier's stick: `puckOnStick` in `src/components/RinkDiagram.tsx` shifts any puck within 3.6 units of a player to that player's rim. Author carried pucks at the carrier's exact coordinates and let the renderer handle the offset.
- `npm run lint` is `tsc --noEmit`; there is no ESLint or test suite. Visual changes to animations need eyeball verification in the running app (`npm run dev`).

## Maintaining this file

Keep this file for knowledge useful to almost every future agent session in this project.
Do not repeat what the codebase already shows; point to the authoritative file or command instead.
Prefer rewriting or pruning existing entries over appending new ones.
When updating this file, preserve this bar for all agents and keep entries concise.
