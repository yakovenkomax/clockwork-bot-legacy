import 'https://deno.land/x/dotenv@v3.2.0/load.ts';
import { TelegramBot, UpdateType } from 'https://deno.land/x/telegram_bot_api@0.4.0/mod.ts';
import { ConfigData, HistoryData, LevelData, TranslationsData, WordData } from '../types/files.type.ts';
import { readJson } from '../utils/readJson.ts';
import { writeJson } from '../utils/writeJson.ts';
import { pickWords } from './pickWords.ts';
import { formatWordsMessage } from './formatWordsMessage.ts';

const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN');
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID');

if (!TELEGRAM_BOT_TOKEN) {
  console.log('TELEGRAM_BOT_TOKEN is not defined. Please set it in .env file.')

  Deno.exit();
}

if (!TELEGRAM_CHAT_ID) {
  console.log('TELEGRAM_CHAT_ID is not defined. Please set it in .env file.')

  Deno.exit();
}

const config: ConfigData = readJson('src/config.json');
const { historyFilePath, levelsFilePath, wordsFilePath, translationsFilePath, targetLanguageCode, wordsMessage } = config;
const { pickLevelsAndCount, uniqueDispatchesCount } = wordsMessage;

try {
  Deno.statSync(historyFilePath)
} catch(e) {
  if (e instanceof Deno.errors.NotFound) {
    writeJson(historyFilePath, []);
  }
}

const history: HistoryData = readJson(historyFilePath);
const levels: LevelData = readJson(levelsFilePath);
const words: WordData = readJson(wordsFilePath);
const translations: TranslationsData = readJson(translationsFilePath);

const pickedWords = pickWords({
  words,
  translations,
  history,
  levels,
  pickLevelsAndCount,
  uniqueDispatchesCount,
});

const wordMessage = formatWordsMessage({
  words: pickedWords,
  translations,
  targetLanguageCode,
});

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

bot.on(UpdateType.Message, async ({ message }) => {
  if (message.text === '/start') {
    await bot.sendMessage({
      chat_id: TELEGRAM_CHAT_ID,
      text: wordMessage,
      parse_mode: 'MarkdownV2',
      disable_web_page_preview: true,
    });
  }
});

bot.run({ polling: true });
