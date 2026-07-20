export type CategoryId =
  | 'animals'
  | 'birds'
  | 'counting'
  | 'abc'
  | 'space'
  | 'countries'
  | 'plants'
  | 'family'
  | 'urdu'
  | 'drawing'

/** 'items' = a scrollable list of learning cards; 'draw' = the drawing canvas. */
export type CategoryKind = 'items' | 'draw'

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
  /** BCP-47 language for {@link speak}, e.g. 'en-US' or 'ur-PK'. Defaults to English. */
  speakLang?: string
  /** Romanised fallback phrases, spoken with an English voice when no {@link speakLang} voice exists. */
  speakRoman?: string[]
  /** Counting cards: how many dots to animate in (1–10). */
  count?: number
  /** ABC cards: uppercase glyph. */
  letterUpper?: string
  /** ABC cards: lowercase glyph. */
  letterLower?: string
  /** Optional CC0 sound-effect file (served from /public). Falls back to speech when absent. */
  soundUrl?: string
  /** Render the big title right-to-left (Urdu / Arabic script). */
  rtl?: boolean
}

/** Visual + content definition for one of the four home-screen categories. */
export interface Category {
  id: CategoryId
  /** Screen type — defaults to a scrollable item list. */
  kind?: CategoryKind
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
