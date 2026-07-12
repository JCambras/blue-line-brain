export interface BadgeInfo {
  name: string;
  desc: string;
  icon: string;
}

export const BADGES: Record<string, BadgeInfo> = {
  retrieval_radar: {
    name: 'Retrieval Radar',
    desc: 'Mastered scanning before puck touches',
    icon: '📡',
  },
  net_front_guard: {
    name: 'Net Front Guard',
    desc: 'Owned the crease',
    icon: '🛡️',
  },
  gap_master: {
    name: 'Gap Master',
    desc: 'Closed the blue line',
    icon: '🎯',
  },
  tape_to_tape: {
    name: 'Tape to Tape',
    desc: 'Hard, accurate breakouts',
    icon: '🎯',
  },
  blue_line_boss: {
    name: 'Blue Line Boss',
    desc: 'Cleared a Boss Battle',
    icon: '👑',
  },
  head_up_hero: {
    name: 'Head Up Hero',
    desc: '10-streak achieved',
    icon: '🦸',
  },
  daily_grinder: {
    name: 'Daily Grinder',
    desc: '5-day daily streak',
    icon: '📅',
  },

  // Lacrosse attack patches
  lax_dodger: {
    name: 'Dodger',
    desc: 'Mastered dodging and initiating',
    icon: '🥍',
  },
  lax_feeder: {
    name: 'Feeder',
    desc: 'Draw two, feed one',
    icon: '🎯',
  },
  lax_ghost: {
    name: 'Ghost',
    desc: 'Deadly off the ball',
    icon: '👻',
  },
  lax_sniper: {
    name: 'Sniper',
    desc: 'Finished where the goalie is not',
    icon: '🚀',
  },
  lax_ride_or_die: {
    name: 'Ride or Die',
    desc: 'Won it back on the ride',
    icon: '🛡️',
  },
  lax_boss: {
    name: 'Field General',
    desc: 'Cleared a lacrosse Boss Battle',
    icon: '👑',
  },
};
