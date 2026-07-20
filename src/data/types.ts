export type CategoryId = 'animals' | 'birds' | 'counting' | 'abc'

/** A single scrollable learning card inside a category. */
export interface Item {
  /** Stable unique id, used as React key. */
  id: string
  /** Large emoji illustration shown on the card. */
  emoji: string
  /** The big bold word/label (e.g. "Cat", "ONE", "A"). */
  title: string
  /** Optional secondary line (e.g. lowercase letter, number word, "is for Apple"). */
  subtitle?: string
  /**
   * Phrases spoken (Web Speech API) when the card snaps into view. Each entry
   * is spoken separately with a ~1s pause between them, e.g.
   * ['A', 'A is for Apple.'] says the letter, pauses, then the sentence.
   */
  speak: string[]
  /** Counting cards: how many dots to animate in (1–10). */
  count?: number
  /** ABC cards: uppercase glyph. */
  letterUpper?: string
  /** ABC cards: lowercase glyph. */
  letterLower?: string
  /** Optional CC0 sound-effect file (served from /public). Falls back to speech when absent. */
  soundUrl?: string
}

/** Visual + content definition for one of the four home-screen categories. */
export interface Category {
  id: CategoryId
  /** Home-screen title, e.g. "Animals". */
  title: string
  /** Short kid-friendly tagline shown under the title. */
  tagline: string
  /** Large emoji shown on the home card. */
  emoji: string
  /** Solid accent colour (hex) used for headings and highlights. */
  accent: string
  /** Vibrant [from, to] gradient for the home-screen card. */
  cardGradient: [string, string]
  /** Soft [from, to] gradient for the category background. */
  bgGradient: [string, string]
  /** The scrollable learning items. */
  items: Item[]
}
