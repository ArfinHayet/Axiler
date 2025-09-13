export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}

export class ResponseUtil {
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, data?: any): ApiResponse<any> {
    return {
      success: false,
      message,
      data,
    };
  }
}
