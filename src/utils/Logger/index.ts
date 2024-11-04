/** Signature of a logging function */
export interface LogFn {
  (message?: any, ...optionalParams: any[]): void;
}

/** Basic logger interface */
export interface Logger {
  log: LogFn;
  warn: LogFn;
  error: LogFn;
}

/** Log levels */
export type LogLevel = "log" | "warn" | "error";

// eslint-disable-next-line unused-imports/no-unused-vars
const NO_OP: LogFn = (_message?: any, ..._optionalParams: any[]) => {};

/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
  readonly log: LogFn;

  readonly warn: LogFn;

  readonly error: LogFn;

  constructor(options?: { level?: LogLevel }) {
    const { level } = options || {};

    // eslint-disable-next-line no-console
    this.error = console.error.bind(console);

    if (level === "error") {
      this.warn = NO_OP;
      this.log = NO_OP;

      return;
    }

    // eslint-disable-next-line no-console
    this.warn = console.warn.bind(console);

    if (level === "warn") {
      this.log = NO_OP;

      return;
    }

    // eslint-disable-next-line no-console
    this.log = console.log.bind(console);
  }
}

const LOG_LEVEL =
  process.env.NEXT_PUBLIC_APP_ENV === "development" ? "log" : "error";
export const logger = new ConsoleLogger({ level: LOG_LEVEL });
