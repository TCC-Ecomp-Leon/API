import { Express, Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';

type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

export default class Context {
  hostname: string;
  url: string;
  body: Record<string, any>;
  header: IncomingHttpHeaders;
  method: Method;
  params: object;

  _variables: { [key: string]: any };

  constructor(req: Request) {
    this.hostname = req.hostname;
    this.url = req.url;
    this.header = req.headers;
    this.body = req.body;
    this.method = req.method as Method;
    if (this.method === undefined || this.method === null)
      throw Error('Invalid http method');
    this.params = { ...req.params, ...req.query };
    this._variables = new Object();
    console.log(this);
  }

  setVariable<T>(key: string, variable: T) {
    this._variables[key] = variable;
  }

  getVariable<T>(key: string): T {
    return this._variables[key] as T;
  }

  getAuthToken(): string | null {
    const authField = this.header.authorization;
    if (authField === undefined) return null;
    const fields = authField.split('Bearer ');
    if (fields.length < 2) return null;
    return fields[1];
  }
}
