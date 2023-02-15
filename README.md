# Clockwork Bot
A Telegram bot to learn the most popular English words.

## Setup

1. Create a Telegram Bot using [@BotFather](https://t.me/botfather);

1. Create a Telegram Channel and add the bot as an admin. Then, get the channel ID by sending a message to the bot and checking the `chat.id` field in the response;

1. Create `.env` file and add the channel ID and the bot token to it.

1. Install [Deno](https://deno.land/#installation)

## Usage

### Data generation

1. Run `deno task generate` to create the data files;

### Bot

1. Run `deno task bot` to start the bot;

### Tests

1. Run `deno test` to run unit tests;
