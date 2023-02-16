import dayjs from 'https://esm.sh/v106/dayjs@1.11.7';
import { WeekdayNames } from '../types/enums.type.ts';
import { ConfigData } from '../types/files.type.ts';

const WEEK_DELAY_MS = 1000 * 60 * 60 * 24 * 7;

type ScheduleWeeklyFunctionCallParams = {
  fn: () => void;
  schedule: ConfigData['wordsMessage']['schedule'];
};

export const scheduleWeeklyFunctionCall = (params: ScheduleWeeklyFunctionCallParams) => {
  const { fn, schedule } = params;

  let intervalId: number | undefined;
  let timeoutId: number | undefined;

  schedule.forEach((entry) => {
    const { weekday, hour, minute } = entry;
    const entryWeekDayIndex = WeekdayNames.indexOf(weekday);
    const entryTime = dayjs().day(entryWeekDayIndex).hour(hour).minute(minute);
    const delayForCurrentWeek = entryTime.diff(dayjs());
    const delay = delayForCurrentWeek > 0 ? delayForCurrentWeek : delayForCurrentWeek + WEEK_DELAY_MS;

    timeoutId = setTimeout(() => {
      fn();

      intervalId = setInterval(fn, WEEK_DELAY_MS);
    }, delay);
  });

  return () => {
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  }
};
