# StudyFlow Design Brief

## Tone
Clean, purposeful, energetic. A student's personal HQ for focus and progress tracking.

## Differentiation
Subject color coding throughout—every class, assignment, and progress bar carries its subject's distinct color. Persistent floating Pomodoro timer as an always-visible productivity anchor. Burnout risk indicator surfaced in stats.

## Palette (OKLCH)
| Token | Light | Dark | Usage |
| - | - | - | - |
| Primary | 0.54 0.19 205 | 0.65 0.22 205 | Teal/cyan—focus, links, primary CTAs |
| Accent | 0.65 0.2 64 | 0.62 0.24 64 | Amber/orange—Pomodoro timer, urgency |
| Destructive | 0.55 0.22 25 | 0.65 0.19 22 | Red—missed deadlines, burnout warning |
| Background | 0.98 0 0 | 0.095 0 0 | Light or near-black canvas |
| Sidebar | 0.96 0 0 | 0.12 0 0 | Navigation column, slightly warmer |

## Subject Colors (chart tokens)
| Chart | Light | Dark | Subject Hue |
| - | - | - | - |
| 1 | 0.58 0.21 210 | 0.68 0.24 210 | Blue |
| 2 | 0.62 0.19 142 | 0.72 0.22 142 | Green |
| 3 | 0.65 0.2 64 | 0.75 0.23 64 | Amber |
| 4 | 0.60 0.2 310 | 0.70 0.24 310 | Purple |
| 5 | 0.68 0.18 355 | 0.78 0.21 355 | Pink |

## Typography
- Display: General Sans (geometric, modern, friendly—dashboard titles)
- Body: DM Sans (neutral, readable—content, assignments)
- Mono: Geist Mono (technical, clean—time displays, timestamps)

## Shape & Radius
Minimal, sharp intent. Cards 6px, buttons 6px, inputs 6px. No bloated shadows.

## Elevation & Depth
- Subtle shadows only (`shadow-sm`). No glow or neon effects.
- Card borders define separation, not shadows.
- Transparent layers for popovers and modals.

## Structural Zones
- **Header**: Teal bar with StudyFlow branding, nav links, user profile (sidebar toggle on mobile).
- **Sidebar**: Narrow column (or collapsible on mobile) with subject list, quick links, settings.
- **Main Content**: Grid of cards—dashboard summary, class schedule, assignments, stats.
- **Floating Timer**: Persistent Pomodoro widget anchored bottom-right, always above content.
- **Footer**: Minimal—credits, help link (optional for productivity focus).

## Spacing & Rhythm
- Dense grid (12-16px gaps). Visual hierarchy through color, not whitespace.
- Compact rows for assignment lists; breathing room for dashboard summary.

## Component Patterns
- Subject badges: Color dot + subject name.
- Progress bars: Subject color fill, neutral background.
- Time display: Mono font, large for timer, small for timestamps.
- Cards: Clean border, light shadow, alternating subject colors for row emphasis.

## Motion
- Smooth transitions (all 0.3s cubic-bezier). No abrupt state changes.
- Pomodoro timer: Gentle fade-in when starting, pulse on focus break alert.
- Assignment status change: Quick color shift from default to completed (strikethrough text).

## Dark Mode
Primary mode. Optimized for evening study sessions. Lightness adjusted for eye comfort; all hues preserved.

## Constraints & Anti-patterns
- No pastel washes or rounded-corner excess.
- No rainbow palettes—only 5 intentional subject colors + core palette.
- No inline gradients or decorative shapes.
- Subject color always present—never a grey-only row.

## Signature Detail
Floating Pomodoro timer widget. Amber-tinted, persistent, clickable to expand/collapse. Shows 25:00 or current session time. Doubles as focus mode indicator.
