import { Frequency, PartOfSpeech } from './enums.type.ts';

export type RawTranslationData = ErrorResponse | SuccessResponse;

type ErrorResponse = {
  statusCode: 500;
  error: string;
  message: string;
}

type SuccessResponse = {
  result: string;
  pronunciation: string;
  from: {
    pronunciation: string;
    suggestions: Array<{
      text: string;
      translation: string;
    }>;
  }
  translations?: {
    [key in PartOfSpeech]: Array<{
      translation: string;
      reversedTranslations: Array<string>;
      frequency: Frequency;
    }>;
  }
  definitions?: {
    [key in PartOfSpeech]: Array<{
      definition: string;
      example: string;
    }>
  }
}
