import { DOMParser } from 'https://esm.sh/linkedom';
import { Level } from '../types/enums.type.ts';
import { ConfigData } from '../types/files.type.ts';
import { readJson } from '../utils/readJson.ts';
import { writeJson } from '../utils/writeJson.ts';

const FALLBACK_LEVEL = Level.A2;

export const downloadWords = async () => {
  const config: ConfigData = readJson('src/config.json');
  const { wordsFilePath, levelsFilePath } = config;

  try {
    const words = readJson(wordsFilePath);

    return words;
  } catch(e) {
    if (e instanceof Deno.errors.NotFound) {
      const res = await fetch('https://www.oxfordlearnersdictionaries.com/wordlists/oxford3000-5000');
      const body = await res.text()
      const document = new DOMParser().parseFromString(body, 'text/html');

      const wordsListItems = [...document.querySelectorAll('.top-g li')];
      const words = wordsListItems.map(item => item.dataset.hw);
      const nonDuplicateWords = [...new Set(words)];
      const wordsByLevels = wordsListItems.reduce((acc, item) => {
        const { hw: word, ox5000: level } = item.dataset;
        const isDuplicate = Object.keys(acc).find(level => acc[level].includes(word));

        if (!isDuplicate) {
          acc[level || FALLBACK_LEVEL] = [...(acc[level] || []), word];
        }

        return acc;
      }, {});
      const sortedLevelKeys = Object.keys(wordsByLevels).sort((a, b) => a.localeCompare(b, 'en'))
      const wordsBySortedLevels = sortedLevelKeys.reduce((acc, key) => {
        acc[key] = wordsByLevels[key];

        return acc;
      }, {});

      writeJson(levelsFilePath, wordsBySortedLevels);
      writeJson(wordsFilePath, nonDuplicateWords);

      return words;
    }
  }
}
