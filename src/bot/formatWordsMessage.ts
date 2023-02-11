import { TranslationsData } from '../types/files.type.ts';
import { PartOfSpeech, PartOfSpeechAbbreviation, FrequencyWeight } from '../types/enums.type.ts';

const getGoogleTranslateLink = (word: string, targetLanguageCode: string) => {
  return `[${word}](https://translate.google.com/?sl=en&tl=${targetLanguageCode}&text=${word}&op=translate)`;
};
const getMainLine = (word: string, translation: string, targetLanguageCode: string) => {
  return `*${getGoogleTranslateLink(word, targetLanguageCode)}* \\- ${translation}`;
};
const getPartOfSpeechLine = (partOfSpeech: PartOfSpeech, translations: Array<string>) => {
  return `  _${PartOfSpeechAbbreviation[partOfSpeech]}\\._  ${translations.join(', ')}`;
};

type FormatWordsMessage = (params: {
  words: Array<string>;
  translations: TranslationsData;
  targetLanguageCode: string;
}) => string;

export const formatWordsMessage: FormatWordsMessage = (params): string => {
  const { words, targetLanguageCode, translations } = params;

  const wordsMessage = words.map(word => {
    const translationEntries = translations[word];
    const mainLine = getMainLine(word, translationEntries.main, targetLanguageCode);
    const partsOfSpeech = Object.keys(translationEntries).filter(key => key !== 'main') as PartOfSpeech[];
    const partsOfSpeechLines = partsOfSpeech.map(partOfSpeech => {
      const sortedTranslationEntries = translationEntries[partOfSpeech].sort((a, b) => {
        return FrequencyWeight[b.frequency] - FrequencyWeight[a.frequency];
      });
      const translationWords = sortedTranslationEntries.map(entry => entry.translation);

      return getPartOfSpeechLine(partOfSpeech, translationWords);
    });

    return [mainLine, ...partsOfSpeechLines].join('\n');
  }).join('\n\n');

  return wordsMessage;
}
