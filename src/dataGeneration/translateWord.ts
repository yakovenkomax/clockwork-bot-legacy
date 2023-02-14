import {
  TranslationsByFrequency,
  TranslationsByPartOfSpeech,
  Translation
} from '../types/files.type.ts';
import { PartOfSpeech } from '../types/enums.type.ts';
import { RawTranslationData } from '../types/network.type.ts';

type TranslateWord = (params: {
  word: string,
  from: string,
  to: string,
  translateApiUrl: string,
}) => Promise<Translation | undefined>;

export const translateWord: TranslateWord = async (params) => {
  const { word, from, to, translateApiUrl } = params;

  try {
    const res = await fetch(`${translateApiUrl}/api?text=${word}&from=${from}&to=${to}`);
    const data: RawTranslationData = await res.json();

    if ('statusCode' in data) {
      return undefined;
    }

    const { result, translations } = data;

    if (!translations) {
      return {
        main: result,
      };
    }

    const partsOfSpeech = Object.keys(translations) as PartOfSpeech[];
    const partOfSpeechTranslations = partsOfSpeech.reduce((acc, partOfSpeech) => {
      const currentPartOfSpeechTranslations = translations[partOfSpeech];
      const usedFrequencies = [...new Set(currentPartOfSpeechTranslations.map(item => item.frequency))];

      acc[partOfSpeech] = usedFrequencies.reduce((acc, frequency) => {
        acc[frequency] = currentPartOfSpeechTranslations.filter(item => item.frequency === frequency).map(item => item.translation);

        return acc;
      }, {} as TranslationsByFrequency);

      return acc;
    }, {} as TranslationsByPartOfSpeech);

    return {
      main: result,
      partsOfSpeech: {
        ...partOfSpeechTranslations
      },
    };
  } catch (error) {
    console.error(`An error occurred during translation of the word "${word}": `, error);

    return undefined;
  }
}
