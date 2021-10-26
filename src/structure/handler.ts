import { Express, Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import Context from './context';
import { NavigationResult } from './navigation';

const mongodbWriteTimeOut = 1000; //ms

type HandlerType<Context, NavigationResult> = (
  context: Context,
  session: ClientSession
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

  run(context: Context, session: ClientSession): Promise<NavigationResult<T>> {
    return this.function(context, session);
  }

  getSession(): Promise<ClientSession> {
    return new Promise<ClientSession>(async (resolve, reject) => {
      try {
        resolve(
          await mongoose.connection.startSession({
            defaultTransactionOptions:
              this.sessionMode === SessionMode.bank
                ? {
                    readConcern: {
                      level: 'majority',
                    },
                    writeConcern: {
                      w: 'majoritary',
                      j: true,
                      wtimeout: mongodbWriteTimeOut,
                    },
                  }
                : undefined,
          })
        );
      } catch (e) {
        reject(e as Error);
      }
    });
  }
}
