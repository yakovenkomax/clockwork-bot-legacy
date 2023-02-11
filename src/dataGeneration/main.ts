import { downloadWords } from './downloadWords.ts';
import { translateWords } from './translateWords.ts';

try {
  Deno.readDirSync('data');
} catch(e) {
  if (e instanceof Deno.errors.NotFound) {
    Deno.mkdirSync('data');
  }
}

const words = await downloadWords();
translateWords(words);
