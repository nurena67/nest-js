export interface ResponseFormat<T> {
  status: number;
  message: string;
  data?: T;

}