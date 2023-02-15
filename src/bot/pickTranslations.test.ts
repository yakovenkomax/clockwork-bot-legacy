import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { removeWordFromAllTranslations } from './pickTranslations.ts';

Deno.test('removeWordFromAllTranslations single', () => {
  assertEquals(removeWordFromAllTranslations({
    translationsByFrequency: {
      common: ['foo', 'bar'],
      uncommon: ['bar', 'baz'],
      rare: ['baz', 'qux'],
    },
    wordToRemove: 'foo',
  }), {
    common: ['bar'],
    uncommon: ['bar', 'baz'],
    rare: ['baz', 'qux'],
  });
});
Deno.test('removeWordFromAllTranslations multiple', () => {
  assertEquals(removeWordFromAllTranslations({
    translationsByFrequency: {
      common: ['foo', 'foo', 'bar'],
      uncommon: ['foo', 'baz'],
      rare: ['foo', 'qux'],
    },
    wordToRemove: 'foo',
  }), {
    common: ['bar'],
    uncommon: ['baz'],
    rare: ['qux'],
  });
});

Deno.test('removeWordFromAllTranslations partial', () => {
  assertEquals(removeWordFromAllTranslations({
    translationsByFrequency: {
      common: ['foo'],
      uncommon: ['bar', 'baz'],
    },
    wordToRemove: 'foo',
  }), {
    uncommon: ['bar', 'baz'],
  });
});

Deno.test('removeWordFromAllTranslations single', () => {
  assertEquals(removeWordFromAllTranslations({
    translationsByFrequency: {
      common: ['foo'],
    },
    wordToRemove: 'foo',
  }), {});
});
