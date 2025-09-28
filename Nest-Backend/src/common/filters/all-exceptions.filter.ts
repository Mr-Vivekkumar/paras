import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

// Pure functional error response creator
const createErrorResponse = (status: number, message: string, path: string) => ({
  statusCode: status,
  timestamp: new Date().toISOString(),
  path,
  message,
});

const getErrorMessage = (exception: unknown): string => {
  if (exception instanceof HttpException) {
    const response = exception.getResponse();
    return typeof response === 'string' ? response : (response as any).message || 'Internal server error';
  }
  
  if (exception instanceof Error) {
    return exception.message;
  }
  
  return 'Internal server error';
};

const getStatus = (exception: unknown): number => {
  if (exception instanceof HttpException) {
    return exception.getStatus();
  }
  
  return HttpStatus.INTERNAL_SERVER_ERROR;
};

const logError = (exception: unknown, request: Request): void => {
  const { method, url } = request;
  const status = getStatus(exception);
  const message = getErrorMessage(exception);
  
  console.error(`[${new Date().toISOString()}] ${method} ${url} - ${status} - ${message}`);
  
  if (!(exception instanceof HttpException)) {
    console.error('Stack trace:', exception);
  }
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = getStatus(exception);

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
