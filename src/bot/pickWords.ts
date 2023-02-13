import {
  ConfigData,
  HistoryData,
  LevelData,
  TranslationsData,
  WordData
} from '../types/files.type.ts';
import { Level } from '../types/enums.type.ts';

type PickWords = (params: {
  words: WordData,
  translations: TranslationsData,
  history: HistoryData,
  levels: LevelData,
  wordPickCount: ConfigData['wordsMessage']['wordPickCount'],
  uniqueDispatchesCount: number,
}) => Array<string>;

export const pickWords: PickWords = (params) => {
  const { words, translations, history, levels, wordPickCount, uniqueDispatchesCount } = params;

  const wordsWithTranslations = words.filter(word => translations[word]);
  const wordsWhitelist = wordsWithTranslations.filter(word => {
    const limitedHistory = history.slice(-uniqueDispatchesCount);
    const blackList = limitedHistory.reduce((acc: Array<string>, entry) => {
      return [...acc, ...entry.words];
    }, []);

    return !blackList.includes(word);
  });

  const levelKeys = Object.keys(wordPickCount) as Array<Level>;
  const pickedWords = levelKeys.reduce((acc: Array<string>, level) => {
    const pickCount = wordPickCount[level as Level];
    const levelWords = levels[level];

    if (!levelWords) {
      return acc;
    }

    const currentLevelWhiteList = levelWords.filter(word => wordsWhitelist.includes(word));

    for (let i = 0; i < pickCount; i++) {
      const randomIndex = Math.floor(Math.random() * currentLevelWhiteList.length);
      const randomWord = currentLevelWhiteList[randomIndex];

      acc.push(randomWord);
    }

    return acc;
  }, []);

  return pickedWords;
}
