import { MAIN_TRANSLATION_KEY, TranslationsData } from '../types/files.type.ts';
import { PartOfSpeech, PartOfSpeechAbbreviation } from '../types/enums.type.ts';

const getGoogleTranslateLink = (word: string, targetLanguageCode: string) => {
  return `[${word}](https://translate.google.com/?sl=en&tl=${targetLanguageCode}&text=${word}&op=translate)`;
};
const getMainLine = (word: string, translation: string, targetLanguageCode: string) => {
  return `*${getGoogleTranslateLink(word, targetLanguageCode)}* \\- ${translation}`;
};
const getPartOfSpeechLine = (partOfSpeech: PartOfSpeech, translationWords: Array<string>) => {
  return `  _${PartOfSpeechAbbreviation[partOfSpeech]}\\._  ${translationWords.join(', ')}`;
};

type FormatWordsMessage = (params: {
  pickedTranslations: TranslationsData;
  targetLanguageCode: string;
}) => string;

export const formatWordsMessage: FormatWordsMessage = (params): string => {
  const { pickedTranslations, targetLanguageCode } = params;

  const wordsMessage = Object.keys(pickedTranslations).map(word => {
    const translationEntries = pickedTranslations[word];
    const mainLine = getMainLine(word, translationEntries.main, targetLanguageCode);
    const partsOfSpeech = Object.keys(translationEntries).filter(key => key !== MAIN_TRANSLATION_KEY) as PartOfSpeech[];
    const partsOfSpeechLines = partsOfSpeech.map(partOfSpeech => {
      const translationWords = translationEntries[partOfSpeech].map(entry => entry.translation);

      return getPartOfSpeechLine(partOfSpeech, translationWords);
    });

    return [mainLine, ...partsOfSpeechLines].join('\n');
  }).join('\n\n');

  return wordsMessage;
}
