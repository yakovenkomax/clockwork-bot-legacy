import { TranslationsByFrequency } from '../../types/files.type.ts';
import { Frequency } from '../../types/enums.type.ts';

type RemoveWordFromAllTranslationsParams = {
  translationsByFrequency: TranslationsByFrequency,
  wordToRemove: string
}

export const removeWordFromAllTranslations = (params: RemoveWordFromAllTranslationsParams) => {
  const { translationsByFrequency, wordToRemove } = params;
  const frequencyKeys = Object.keys(translationsByFrequency) as Array<Frequency>;

  return frequencyKeys.reduce((acc, frequency) => {
    const translationsForFrequency = translationsByFrequency[frequency];

    if (!translationsForFrequency) {
      return acc;
    }

    const filteredTranslations = translationsForFrequency.filter(translation => translation !== wordToRemove);

    if (filteredTranslations.length === 0) {
      return acc;
    }

    return {
      ...acc,
      [frequency]: filteredTranslations,
    }
  }, {} as TranslationsByFrequency);
}
