import { ScenarioType } from './types';

export const SCENARIOS = [
  { id: ScenarioType.LATE, label: "Running Late 🐢", emoji: "🐢" },
  { id: ScenarioType.FORGOT, label: "Forgot Date 📅", emoji: "📅" },
  { id: ScenarioType.FOOD, label: "Ate Leftovers 🍕", emoji: "🍕" },
  { id: ScenarioType.GHOSTED, label: "Accidental Ghost 👻", emoji: "👻" },
  { id: ScenarioType.CLUMSY, label: "Clumsy Moment 💥", emoji: "💥" },
];

export const PRESET_RESPONSES = [
  "It's okay, I forgive you! 💖",
  "You owe me dinner now. 🍔",
  "Fine, but don't do it again. 😤",
  "Send $5 and we're cool. 💸",
];
