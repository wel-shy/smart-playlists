/**
 * Structure a json api response.
 */
export class Reply {
  messages: string;
  code: number;
  errors: boolean;
  payload: any;

  constructor(code: number, errors: boolean, messages: string,  payload: any) {
    this.messages = messages;
    this.code = code;
    this.errors = errors;
    this.payload = payload;
  }
}
