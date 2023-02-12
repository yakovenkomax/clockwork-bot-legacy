import 'https://deno.land/x/dotenv@v3.2.0/load.ts';
import { downloadWords } from './downloadWords.ts';
import { translateWords } from './translateWords.ts';

const TRANSLATE_API_URL = Deno.env.get('TRANSLATE_API_URL');

try {
  Deno.readDirSync('data');
} catch(e) {
  if (e instanceof Deno.errors.NotFound) {
    Deno.mkdirSync('data');
  }
}

const words = await downloadWords();

if (!TRANSLATE_API_URL) {
  console.log('TRANSLATE_API_URL is not defined. Please set it in .env file.')

  Deno.exit();
}

translateWords({ words, translateApiUrl: TRANSLATE_API_URL });
