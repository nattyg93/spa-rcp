import { JsonapiResponseDoc } from 'spraypaint';

declare global {
  interface ErrorResponse extends Error {
    response?: JsonapiResponseDoc;
  }
  interface HeadersExt extends Headers {
    'X-CSRFTOKEN'?: string;
    'Authorization'?: string;
  }
  interface ResponseExt extends Response {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    errors?: any[];
  }

  interface ButtonInterface {
    key: string;
    title: string;
    color: string;
    text: boolean;
    outlined: boolean;
  }
}
