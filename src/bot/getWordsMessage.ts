import { pickWords } from './pickWords.ts';
import { pickTranslations } from './pickTranslations.ts';
import { formatWordsMessage } from './formatWordsMessage.ts';
import { ConfigData, HistoryData, LevelData, TranslationsData, WordData } from '../types/files.type.ts';

type GetWordsMessageParams = {
  words: WordData;
  translations: TranslationsData;
  history: HistoryData;
  levels: LevelData;
  wordPickCount: ConfigData['wordsMessage']['wordPickCount'];
  uniqueDispatchesCount: ConfigData['wordsMessage']['uniqueDispatchesCount'];
  translationPickCount: ConfigData['wordsMessage']['translationPickCount'];
  targetLanguageCode: ConfigData['targetLanguageCode'];
}

export const getWordsMessage = (params: GetWordsMessageParams) => {
  const {
    words,
    translations,
    history,
    levels,
    wordPickCount,
    uniqueDispatchesCount,
    translationPickCount,
    targetLanguageCode,
  } = params;

  const pickedWords = pickWords({
    words,
    translations,
    history,
    levels,
    wordPickCount,
    uniqueDispatchesCount,
  });

  const pickedTranslations = pickTranslations({
    pickedWords,
    translations,
    translationPickCount,
  })

  const wordMessage = formatWordsMessage({
    pickedTranslations,
    targetLanguageCode,
  });

  return wordMessage;
}
