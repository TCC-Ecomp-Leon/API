import { Express, Request, Response } from 'express';
import { ClientSession, Db } from 'mongodb';
import { DatabaseService, withDatabaseTransaction } from '../config/database';
import { authHandler } from '../handlers/auth/authHandler';
import { checkLoginToken } from '../services/authentification/firebaseAuth';
import Context from './context';
import { DatabaseResult } from './databaseResult';
import Handler from './handler';
import { OperationResult } from './response';

export type NavigationResult<T> = OperationResult<T>;

export default class Navigation {
  handlers: Array<Handler<any>>;

  constructor(handlers: Array<Handler<any>>) {
    this.handlers = handlers;
  }

  async navigate(context: Context): Promise<
    | {
        success: true;
        status: number;
        body: any;
      }
    | {
        success: false;
        error: Error;
      }
  > {
    for (let i = 0; i < this.handlers.length; i++) {
      try {
        const handler: Handler<any> = this.handlers[i];
        const result = await handler.run(context);

        if (result !== null) {
          return { ...result, success: true };
        }
      } catch (e) {
        return {
          success: false,
          error: e as Error,
        };
      }
    }

    return { error: Error('Handlers without response'), success: false };
  }
}

export const ProtectedNavigation = <T>(
  handlers: Array<Handler<any>>,
  getProfile: (
    userId: string,
    email: string,
    session: ClientSession,
    db: Db
  ) => Promise<DatabaseResult<T | null>>,
  roleFunction?: (profile: T) => boolean
) => {
  return new Navigation([authHandler(getProfile, roleFunction), ...handlers]);
};
