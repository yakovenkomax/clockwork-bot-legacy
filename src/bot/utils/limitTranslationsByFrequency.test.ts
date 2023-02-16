import { assertEquals } from 'https://deno.land/std@0.177.0/testing/asserts.ts';
import { limitTranslationsByFrequency } from './limitTranslationsByFrequency.ts';

Deno.test('limitTranslationsByFrequency empty', () => {
  assertEquals(limitTranslationsByFrequency({
    translationsByFrequency: {},
    maxPerFrequency: {
      common: 1,
      uncommon: 1,
      rare: 1,
    },
  }), {});
  assertEquals(limitTranslationsByFrequency({
    translationsByFrequency: {
      common: ['foo'],
    },
    maxPerFrequency: {},
  }), {
    common: ['foo'],
  });
  assertEquals(limitTranslationsByFrequency({
    translationsByFrequency: {
      common: ['foo'],
    },
    maxPerFrequency: {
      common: 0,
    },
  }), {});
});

Deno.test('limitTranslationsByFrequency single', () => {
  assertEquals(limitTranslationsByFrequency({
    translationsByFrequency: {
      common: ['foo'],
      uncommon: ['bar'],
      rare: ['baz'],
    },
    maxPerFrequency: {
      common: 1,
      uncommon: 1,
      rare: 1,
    },
  }), {
    common: ['foo'],
    uncommon: ['bar'],
    rare: ['baz'],
  });
});

Deno.test('limitTranslationsByFrequency multiple', () => {
  assertEquals(limitTranslationsByFrequency({
    translationsByFrequency: {
      common: ['foo', 'foo'],
      uncommon: ['bar', 'bar'],
      rare: ['baz', 'baz'],
    },
    maxPerFrequency: {
      common: 1,
      uncommon: 1,
      rare: 1,
    },
  }), {
    common: ['foo'],
    uncommon: ['bar'],
    rare: ['baz'],
  });
  assertEquals(limitTranslationsByFrequency({
    translationsByFrequency: {
      common: ['foo', 'foo', 'foo'],
    },
    maxPerFrequency: {
      common: 999,
      uncommon: 1,
      rare: 1,
    },
  }), {
    common: ['foo', 'foo', 'foo'],
  });
});
