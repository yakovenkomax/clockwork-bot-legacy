import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { isEnoughTranslationsToInclude } from './isEnoughTranslationsToInclude.ts';

Deno.test('isEnoughTranslationsToInclude single', () => {
  assertEquals(isEnoughTranslationsToInclude({
    translationsByFrequency: {
      common: ['foo'],
    },
    minPerPartOfSpeech: {
      common: 1,
    },
  }), true);
  assertEquals(isEnoughTranslationsToInclude({
    translationsByFrequency: {
      uncommon: ['foo'],
    },
    minPerPartOfSpeech: {
      common: 1,
    },
  }), false);
});

Deno.test('isEnoughTranslationsToInclude multiple', () => {
  assertEquals(isEnoughTranslationsToInclude({
    translationsByFrequency: {
      common: ['foo'],
      uncommon: ['bar'],
    },
    minPerPartOfSpeech: {
      common: 1,
      uncommon: 1,
    },
  }), true);
  assertEquals(isEnoughTranslationsToInclude({
    translationsByFrequency: {
      uncommon: ['bar'],
    },
    minPerPartOfSpeech: {
      common: 1,
      uncommon: 1,
    },
  }), true);
  assertEquals(isEnoughTranslationsToInclude({
    translationsByFrequency: {
      common: ['foo'],
    },
    minPerPartOfSpeech: {
      common: 1,
      uncommon: 1,
    },
  }), true);
  assertEquals(isEnoughTranslationsToInclude({
    translationsByFrequency: {
      rare: ['baz'],
    },
    minPerPartOfSpeech: {
      common: 1,
      uncommon: 1,
    },
  }), false);
});
