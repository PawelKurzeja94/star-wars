export interface ApiResponse<T> {
  message: string;
  result: {
    properties: T;
    description: string;
    uid: string;
    _id: string;
    __v: number;
  };
}
