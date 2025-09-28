import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

// Pure functional error response creator
const createErrorResponse = (status: number, message: string, path: string) => ({
  statusCode: status,
  timestamp: new Date().toISOString(),
  path,
  message,
});

const getErrorMessage = (exception: HttpException): string => {
  const response = exception.getResponse();
  return typeof response === 'string' ? response : (response as any).message || 'Internal server error';
};

const logError = (exception: HttpException, request: Request): void => {
  const { method, url } = request;
  const status = exception.getStatus();
  const message = getErrorMessage(exception);
  
  console.error(`[${new Date().toISOString()}] ${method} ${url} - ${status} - ${message}`);
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    // Log the error
    logError(exception, request);

    // Create error response
    const errorResponse = createErrorResponse(
      status,
      getErrorMessage(exception),
      request.url,
    );

    response.status(status).json(errorResponse);
  }
}
