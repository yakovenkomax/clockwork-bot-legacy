export enum Level {
  A1 = 'a1',
  A2 = 'a2',
  B1 = 'b1',
  B2 = 'b2',
}

export enum Frequency {
  COMMON = 'common',
  UNCOMMON = 'uncommon',
  RARE = 'rare',
}

export enum PartOfSpeech {
  ARTICLE = 'article',
  NOUN = 'noun',
  ABBREVIATION = 'abbreviation',
  VERB = 'verb',
  ADJECTIVE = 'adjective',
  PREPOSITION = 'preposition',
  ADVERB = 'adverb',
  CONJUNCTION = 'conjunction',
  PRONOUN = 'pronoun',
  AUXILIARY_VERB = 'auxiliary verb'
}

export const PartOfSpeechAbbreviation = {
  [PartOfSpeech.NOUN]: 'n',
  [PartOfSpeech.VERB]: 'v',
  [PartOfSpeech.ADJECTIVE]: 'adj',
  [PartOfSpeech.ADVERB]: 'adv',
  [PartOfSpeech.PREPOSITION]: 'prep',
  [PartOfSpeech.CONJUNCTION]: 'conj',
  [PartOfSpeech.PRONOUN]: 'pron',
  [PartOfSpeech.ARTICLE]: 'art',
  [PartOfSpeech.AUXILIARY_VERB]: 'aux',
  [PartOfSpeech.ABBREVIATION]: 'abbr',
}

export const FrequencyWeight = {
  [Frequency.COMMON]: 3,
  [Frequency.UNCOMMON]: 2,
  [Frequency.RARE]: 1,
}

export enum Weekday {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}

export const WeekdayNames = [
  Weekday.SUNDAY,
  Weekday.MONDAY,
  Weekday.TUESDAY,
  Weekday.WEDNESDAY,
  Weekday.THURSDAY,
  Weekday.FRIDAY,
  Weekday.SATURDAY
]
