import type { Scenario } from '@/types';

/**
 * Real Examples: actual moments from the player's own games, taught in the same
 * animation -> freeze -> decision -> feedback loop as every other scenario, but
 * marked with `realGame` so the app routes them into the hockey module's "Real
 * Examples" section and frames them as "this actually happened in one of your
 * games" (see `RealGameExample` in `src/types/index.ts`).
 *
 * Adding a new example is a single `Scenario` entry in this array - no UI work.
 * Keep the tone age-appropriate and encouraging: the lesson is always "make the
 * smarter play next time", never shaming. Follow the same authoring rules as the
 * rest of the bank (`src/data/scenarios/AUTHORING.md`): full animation +
 * `narration`, a `freezeLine`, and `npm run narrate` to render the clips.
 */
export const REAL_EXAMPLE_SCENARIOS: Scenario[] = [
  {
    id: 're-rush-both-cuts',
    zone: 'offensive',
    category: 'decision',
    difficulty: 'rookie',
    title: 'Both Cuts Taken Away',
    setup:
      'You jumped up into the rush with the puck. You went to cut outside - the D took it away. You cut back inside - that lane is gone too. Your winger is driving the far side.',
    realGame: {
      context:
        "You had it on a rush and both lanes closed up. This one's straight from your own game - let's learn from it.",
    },
    kind: 'mcq',
    options: [
      {
        text: 'Put your head down and drive into the traffic',
        correct: false,
        feedback:
          'That is where it got stripped last time. Two defenders, no lane - you lose it, and now they are gone the other way.',
        trap: 'You are a step from the net and want to make a play, but there is no lane there.',
      },
      {
        text: 'Force it across the middle to your winger',
        correct: false,
        feedback:
          'A flat pass across the slot with two D on you is a turnover into a rush the other way. Dump it in for him instead.',
        trap: 'Your winger is over there, but a cross-ice puck through traffic is the one they pick off.',
      },
      {
        text: 'Dump it in for your winger and spin back to protect the line',
        correct: true,
        feedback:
          'That is a D-man play. Get it in deep for your winger to chase, then spin back and guard the blue line. He forechecks, you stay home for the counter - live to fight another day.',
      },
    ],
    coachCue: 'No lane? Dump it in, spin back, protect the line.',
    visual: {
      rinkZone: 'offensive',
      youId: 'd',
      players: [
        { id: 'd', team: 'home', x: 56, y: 29, label: 'D' },
        { id: 'w', team: 'home', x: 33, y: 27, label: 'W' },
        { id: 'ad1', team: 'away', x: 62, y: 31, label: 'D' },
        { id: 'ad2', team: 'away', x: 51, y: 25, label: 'D' },
        { id: 'g', team: 'away', x: 50, y: 7, label: 'G' },
      ],
      puck: { x: 56, y: 29 },
    },
    animation: {
      beats: [
        {
          t: 0,
          players: {
            d: { x: 68, y: 64 },
            w: { x: 40, y: 60 },
            ad1: { x: 62, y: 40 },
            ad2: { x: 50, y: 34 },
          },
          puck: { x: 68, y: 64 },
          narration: 'You jump into the rush up the right wing, your winger driving the far side.',
        },
        {
          t: 3.5,
          players: {
            d: { x: 70, y: 48 },
            w: { x: 36, y: 44 },
            ad1: { x: 66, y: 40 },
            ad2: { x: 51, y: 33 },
          },
          puck: { x: 70, y: 48 },
          narration: 'You drive wide to beat the first D - he slides over and takes the outside away.',
        },
        {
          t: 7,
          players: {
            d: { x: 60, y: 34 },
            w: { x: 34, y: 30 },
            ad1: { x: 64, y: 36 },
            ad2: { x: 52, y: 30 },
          },
          puck: { x: 60, y: 34 },
          narration: 'You cut back inside, but their second D steps up and shuts that lane too.',
        },
        {
          t: 11,
          players: {
            d: { x: 56, y: 29 },
            w: { x: 33, y: 27 },
            ad1: { x: 62, y: 31 },
            ad2: { x: 51, y: 25 },
          },
          puck: { x: 56, y: 29 },
          narration: 'Both lanes gone, traffic ahead - your winger is driving the far side...',
        },
        { t: 12.5 },
      ],
      freezeLine: 'Both cuts are taken away. What do you do with it?',
      narration:
        'You jump up into the rush and drive the right wing. You go to beat the first D wide, but he takes the outside away. You cut back inside, and their second D shuts that door too. Both lanes are gone, but your winger is driving the far side.',
    },
  },
];
