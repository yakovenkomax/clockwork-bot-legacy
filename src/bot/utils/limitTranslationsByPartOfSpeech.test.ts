import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { limitTranslationsByPartOfSpeech } from './limitTranslationsByPartOfSpeech.ts';

Deno.test('limitTranslationsByPartOfSpeech empty', () => {
  assertEquals(limitTranslationsByPartOfSpeech({
    translationsByFrequency: {},
    maxPerPartOfSpeech: 100,
  }), {});
  assertEquals(limitTranslationsByPartOfSpeech({
    translationsByFrequency: {
      common: [],
    },
    maxPerPartOfSpeech: 100,
  }), {});
  assertEquals(limitTranslationsByPartOfSpeech({
    translationsByFrequency: {
      common: ['foo'],
      uncommon: ['bar'],
      rare: ['baz'],
    },
    maxPerPartOfSpeech: 0,
  }), {});
});

Deno.test('limitTranslationsByPartOfSpeech single', () => {
  assertEquals(limitTranslationsByPartOfSpeech({
    translationsByFrequency: {
      common: ['foo', 'foo', 'foo'],
      uncommon: ['bar', 'bar', 'bar'],
      rare: ['baz', 'baz', 'baz'],
    },
    maxPerPartOfSpeech: 1,
  }), {
    common: ['foo'],
  });
  assertEquals(limitTranslationsByPartOfSpeech({
    translationsByFrequency: {
      uncommon: ['bar', 'bar', 'bar'],
      rare: ['baz', 'baz', 'baz'],
    },
    maxPerPartOfSpeech: 1,
  }), {
    uncommon: ['bar'],
  });
  assertEquals(limitTranslationsByPartOfSpeech({
    translationsByFrequency: {
      rare: ['baz', 'baz', 'baz'],
    },
    maxPerPartOfSpeech: 1,
  }), {
    rare: ['baz'],
  });
});

Deno.test('limitTranslationsByPartOfSpeech multiple', () => {
  assertEquals(limitTranslationsByPartOfSpeech({
    translationsByFrequency: {
      common: ['foo', 'foo', 'foo'],
      uncommon: ['bar', 'bar', 'bar'],
      rare: ['baz', 'baz', 'baz'],
    },
    maxPerPartOfSpeech: 4,
  }), {
    common: ['foo', 'foo', 'foo'],
    uncommon: ['bar'],
  });
  assertEquals(limitTranslationsByPartOfSpeech({
    translationsByFrequency: {
      uncommon: ['bar', 'bar', 'bar'],
      rare: ['baz', 'baz', 'baz'],
    },
    maxPerPartOfSpeech: 4,
  }), {
    uncommon: ['bar', 'bar', 'bar'],
    rare: ['baz'],
  });
  assertEquals(limitTranslationsByPartOfSpeech({
    translationsByFrequency: {
      rare: ['baz', 'baz', 'baz'],
    },
    maxPerPartOfSpeech: 4,
  }), {
    rare: ['baz', 'baz', 'baz'],
  });
  assertEquals(limitTranslationsByPartOfSpeech({
    translationsByFrequency: {
      common: ['foo'],
      uncommon: ['bar'],
      rare: ['baz', 'baz', 'baz'],
    },
    maxPerPartOfSpeech: 4,
  }), {
    common: ['foo'],
    uncommon: ['bar'],
    rare: ['baz', 'baz'],
  });
});
