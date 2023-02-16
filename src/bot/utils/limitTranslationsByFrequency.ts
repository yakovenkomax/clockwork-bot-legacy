import { ConfigData, TranslationsByFrequency } from '../../types/files.type.ts';
import { Frequency } from '../../types/enums.type.ts';

type LimitTranslationsByFrequencyParams = {
  translationsByFrequency: TranslationsByFrequency,
  maxPerFrequency: ConfigData['wordsMessage']['translationPickCount']['maxPerFrequency'],
}

export const limitTranslationsByFrequency = (params: LimitTranslationsByFrequencyParams) => {
  const { translationsByFrequency, maxPerFrequency } = params;

  const frequencyKeys = Object.keys(translationsByFrequency) as Array<Frequency>;
  const limitedTranslationsByFrequency = frequencyKeys.reduce((acc, frequency) => {
    const translationsForFrequency = translationsByFrequency[frequency];
    const limitPerFrequency = maxPerFrequency[frequency];

    if (!translationsForFrequency) {
      return acc;
    }

    let limitedTranslations = translationsForFrequency;

    if (typeof limitPerFrequency === 'number') {
      limitedTranslations = translationsForFrequency.slice(0, limitPerFrequency);
    }

    if (limitedTranslations.length > 0) {
      acc[frequency] = limitedTranslations;
    }

    return acc;
  }, {} as TranslationsByFrequency);

  return limitedTranslationsByFrequency;
}
