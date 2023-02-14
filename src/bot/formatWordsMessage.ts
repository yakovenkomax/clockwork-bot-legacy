import { TranslationsData } from '../types/files.type.ts';
import { Frequency, FrequencyWeight, PartOfSpeech, PartOfSpeechAbbreviation } from '../types/enums.type.ts';

const getGoogleTranslateLink = (word: string, targetLanguageCode: string) => {
  return `[${word}](https://translate.google.com/?sl=en&tl=${targetLanguageCode}&text=${word}&op=translate)`;
};
const getMainLine = (word: string, translation: string, targetLanguageCode: string) => {
  return `*${getGoogleTranslateLink(word, targetLanguageCode)}* – ${translation}`;
};
const getPartOfSpeechLine = (partOfSpeech: PartOfSpeech, translationWords: Array<string>) => {
  return `  _${PartOfSpeechAbbreviation[partOfSpeech]}._  ${translationWords.join(', ')}`;
};

type FormatWordsMessage = (params: {
  pickedTranslations: TranslationsData;
  targetLanguageCode: string;
}) => string;

export const formatWordsMessage: FormatWordsMessage = (params): string => {
  const { pickedTranslations, targetLanguageCode } = params;

  const wordsMessage = Object.keys(pickedTranslations).map(word => {
    const currentWordTranslation = pickedTranslations[word];
    const mainLine = getMainLine(word, currentWordTranslation.main, targetLanguageCode);
    const partsOfSpeechTranslations = currentWordTranslation.partsOfSpeech;

    if (typeof partsOfSpeechTranslations === 'undefined') {
      return mainLine;
    }

    const partsOfSpeech = Object.keys(partsOfSpeechTranslations) as PartOfSpeech[];
    const partsOfSpeechLines = partsOfSpeech.reduce((acc, partOfSpeech) => {
      const translationsByFrequency = partsOfSpeechTranslations[partOfSpeech];

      if (!translationsByFrequency) {
        return acc;
      }

      const frequencyKeys = Object.keys(translationsByFrequency) as Array<Frequency>;
      const sortedFrequencyKeys = frequencyKeys.sort((a, b) => FrequencyWeight[b] - FrequencyWeight[a]);
      const translationWords = sortedFrequencyKeys.reduce((acc, frequency) => {
        const translationsForFrequency = translationsByFrequency[frequency];

        if (!translationsForFrequency) {
          return acc;
        }

        acc.push(...translationsForFrequency);

        return acc;
      }, [] as Array<string>);

      const line = getPartOfSpeechLine(partOfSpeech, translationWords);

      acc.push(line);

      return acc;
    }, [] as Array<string>);

    return [mainLine, ...partsOfSpeechLines].join('\n');
  }).join('\n\n');

  const sanitizedWordsMessage = wordsMessage.replace(/-/g, '\\-').replace(/\./g, '\\.');

  return sanitizedWordsMessage;
}
