import { writeJson } from '../utils/writeJson.ts';
import { translateWord } from './translateWord.ts';
import { readJson } from '../utils/readJson.ts';
import { ConfigData, TranslationsData } from '../types/files.type.ts';

const SAVE_AFTER_SUCCESSFUL_TRANSLATIONS_COUNT = 10;

type TranslateWords = (params: {
  words: string[],
  translateApiUrl: string,
}) => void;

export const translateWords: TranslateWords = (params) => {
  const { words, translateApiUrl } = params;
  const config: ConfigData = readJson('src/config.json');
  const { translationsFilePath, targetLanguageCode } = config;

  let translationsData: TranslationsData;

  try {
    translationsData = readJson(translationsFilePath)
  } catch(e) {
    if (e instanceof Deno.errors.NotFound) {
      writeJson(translationsFilePath, {});
      translationsData = {};
    }
  }

  const wordsInTranslation = new Set();
  let progressCount = 0;

  const translationInterval = setInterval(async () => {
    const nextUntranslatedWord = words.find(word => {
      const isNotTranslated = !Object.keys(translationsData).includes(word);
      const isNotInTranslation = !wordsInTranslation.has(word);

      return isNotTranslated && isNotInTranslation;
    });

    if (!nextUntranslatedWord) {
      clearInterval(translationInterval);
      writeJson(translationsFilePath, translationsData);

      console.log('All words are translated.')

      return;
    }

    wordsInTranslation.add(nextUntranslatedWord);

    const wordTranslation = await translateWord({
      word: nextUntranslatedWord,
      from: 'en',
      to: targetLanguageCode,
      translateApiUrl,
    })

    if (wordTranslation) {
      console.log(`${words.indexOf(nextUntranslatedWord) + 1}/${words.length} ${nextUntranslatedWord} - ${wordTranslation.main}`);
      wordsInTranslation.delete(nextUntranslatedWord)

      translationsData = {
        ...translationsData,
        [nextUntranslatedWord]: wordTranslation,
      };

      progressCount += 1;

      if (progressCount % SAVE_AFTER_SUCCESSFUL_TRANSLATIONS_COUNT === 0) {
        writeJson(translationsFilePath, translationsData);
      }
    }
  }, 5000);
}
