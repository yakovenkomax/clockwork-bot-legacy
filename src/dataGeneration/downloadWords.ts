import { DOMParser } from 'https://esm.sh/linkedom';
import { Level } from '../types/enums.type.ts';
import { ConfigData, LevelData } from '../types/files.type.ts';
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
      const words = wordsListItems.map(item => item.children.item(0).innerText);
      const nonDuplicateWords = [...new Set(words)];
      const wordsByLevels = wordsListItems.reduce((acc, item) => {
        const word = item.children.item(0).innerText;
        const { ox5000: level, ox3000: secondaryLevel } = item.dataset;
        const isDuplicate = Object.keys(acc).find(level => acc[level].includes(word));

        if (!isDuplicate) {
          acc[level || secondaryLevel || FALLBACK_LEVEL] = [...(acc[level] || []), word];
        }

        return acc;
      }, {});
      const sortedLevelKeys = Object.keys(wordsByLevels).sort(
        (a, b) => a.localeCompare(b, 'en')
      ) as Array<Level>;
      const wordsBySortedLevels = sortedLevelKeys.reduce((acc, key) => {
        acc[key] = wordsByLevels[key];

        return acc;
      }, {} as LevelData);

      writeJson(levelsFilePath, wordsBySortedLevels);
      writeJson(wordsFilePath, nonDuplicateWords);

      return words;
    }
  }
}
