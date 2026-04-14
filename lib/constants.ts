import { NavItem } from "./types";

export const PL2026_NAV_ITEMS: NavItem[] = [
  { path: "/pl-2026/scores", text: "Scores" },
  { path: "/pl-2026/table", text: "Edit Table" },
];

export const WC2026_NAV_ITEMS: NavItem[] = [
  { path: "/wc-2026/how-it-works", text: "How It Works" },
  { path: "/wc-2026/submit-entry", text: "Enter Competition" },
  { path: "/wc-2026/scores", text: "Result" },
  { path: "/wc-2026/table", text: "WC Table" },
];

export const WC2026_FAQS = [
  {
    id: 1,
    question: "When can I submit my entry?",
    answer:
      "Any time from now. You can make changes until the first match by letting me know directly.",
  },
  {
    id: 2,
    question: "How many entries can I submit?",
    answer:
      "Just the one but that can be in multiple leagues, if multiple leagues exist",
  },
  {
    id: 3,
    question: "When will you update scores?",
    answer:
      "I'll only update the leaderboard after the first round of matches is complete, so that everyone is on a level playing field. I'll aim to update the scores within 24 hours of the matches finishing.",
  },
];
