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
  pickLevelsAndCount: ConfigData['wordsMessage']['pickLevelsAndCount'],
  uniqueDispatchesCount: number,
}) => Array<string>;

export const pickWords: PickWords = (params) => {
  const { words, translations, history, levels, pickLevelsAndCount, uniqueDispatchesCount } = params;

  const wordsWithTranslations = words.filter(word => translations[word]);
  const wordsWhitelist = wordsWithTranslations.filter(word => {
    const limitedHistory = history.slice(-uniqueDispatchesCount);
    const blackList = limitedHistory.reduce((acc: Array<string>, entry) => {
      return [...acc, ...entry.words];
    }, []);

    return !blackList.includes(word);
  });

  const levelKeys = Object.keys(pickLevelsAndCount) as Array<Level>;
  const pickedWords = levelKeys.reduce((acc: Array<string>, level) => {
    const pickCount = pickLevelsAndCount[level as Level];
    const currentLevelWhiteList = levels[level].filter(word => wordsWhitelist.includes(word));

    for (let i = 0; i < pickCount; i++) {
      const randomIndex = Math.floor(Math.random() * currentLevelWhiteList.length);
      const randomWord = currentLevelWhiteList[randomIndex];

      acc.push(randomWord);
    }

    return acc;
  }, []);

  return pickedWords;
}
