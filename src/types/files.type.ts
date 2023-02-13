import { Frequency, Level, PartOfSpeech } from './enums.type.ts';

export type ConfigData = {
  wordsFilePath: string,
  levelsFilePath: string,
  translationsFilePath: string,
  historyFilePath: string,
  targetLanguageCode: string,
  wordsMessage: {
    uniqueDispatchesCount: number,
    wordPickCount: {
      [key in Level]: number;
    },
    translationPickCount: {
      maxPerPartOfSpeech: number,
      minPerPartOfSpeech: {
        [key in Frequency]: number;
      },
      maxPerFrequency: {
        [key in Frequency]: number;
      }
    }
  }
}

export type WordData = Array<string>;

export type LevelData = {
  [key in Level]?: Array<string>;
}

export type HistoryData = Array<{
  date: string;
  type: string;
  words: Array<string>;
}>;

export type PartOfSpeechTranslation = {
  translation: string,
  frequency: Frequency,
}

export type PartsOfSpeechTranslations = {
  [key in PartOfSpeech]?: Array<PartOfSpeechTranslation>;
}

export type Translation = {
  main: string;
  partsOfSpeech?: PartsOfSpeechTranslations;
};

export type TranslationsData = {
  [word: string]: Translation;
}
