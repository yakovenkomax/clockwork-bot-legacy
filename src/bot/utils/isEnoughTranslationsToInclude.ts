import { ConfigData, TranslationsByFrequency } from '../../types/files.type.ts';
import { Frequency } from '../../types/enums.type.ts';

const DEFAULT_TRANSLATION_LIMIT = 999;

type IsEnoughTranslationsToIncludeParams = {
  translationsByFrequency: TranslationsByFrequency,
  minPerPartOfSpeech: ConfigData['wordsMessage']['translationPickCount']['minPerPartOfSpeech'],
}

export const isEnoughTranslationsToInclude = (params: IsEnoughTranslationsToIncludeParams) => {
  const { translationsByFrequency, minPerPartOfSpeech } = params;


  let isEnoughToInclude = false;

  const frequencyKeys = Object.keys(translationsByFrequency) as Array<Frequency>;

  frequencyKeys.forEach(frequency => {
    const translationsForFrequency = translationsByFrequency[frequency];
    const minTranslationLimit = minPerPartOfSpeech[frequency] || DEFAULT_TRANSLATION_LIMIT;

    if (!translationsForFrequency) {
      return;
    }

    isEnoughToInclude = isEnoughToInclude || translationsForFrequency?.length >= minTranslationLimit;
  })

  return isEnoughToInclude;
}
