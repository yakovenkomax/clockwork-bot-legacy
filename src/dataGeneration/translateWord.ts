import {
  PartOfSpeechTranslation,
  PartsOfSpeechTranslations,
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
    const translationsWithoutReversed = partsOfSpeech.reduce((acc, partOfSpeech) => {
      acc[partOfSpeech] = translations[partOfSpeech].map((item: PartOfSpeechTranslation) => ({
        translation: item.translation,
        frequency: item.frequency,
      }));

      return acc;
    }, {} as PartsOfSpeechTranslations);

    return {
      main: result,
      partsOfSpeech: {
        ...translationsWithoutReversed
      },
    };
  } catch (error) {
    console.error(`An error occurred during translation of the word "${word}": `, error);

    return undefined;
  }
}
