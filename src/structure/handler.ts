import { Express, Request, Response } from 'express';
import Context from './context';
import { NavigationResult } from './navigation';

const mongodbWriteTimeOut = 1000; //ms

type HandlerType<Context, NavigationResult> = (
  context: Context
) => Promise<NavigationResult>;

export enum SessionMode {
  default = 1,
  bank = 2,
}

export default class Handler<T> {
  function: HandlerType<Context, NavigationResult<T>>;
  sessionMode: SessionMode;

  constructor(
    handler: HandlerType<Context, NavigationResult<T>>,
    sessionMode?: SessionMode
  ) {
    this.function = handler;
    this.sessionMode =
      sessionMode !== undefined ? sessionMode : SessionMode.default;
  }

  run(context: Context): Promise<NavigationResult<T>> {
    return this.function(context);
  }
}
