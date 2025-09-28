import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

// Pure functional logging utilities
const logRequest = (request: Request): void => {
  const { method, url, ip } = request;
  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${ip}`);
};

const logResponse = (request: Request, response: Response, startTime: number): void => {
  const { method, url } = request;
  const { statusCode } = response;
  const duration = Date.now() - startTime;
  console.log(`[${new Date().toISOString()}] ${method} ${url} - ${statusCode} - ${duration}ms`);
};

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const startTime = Date.now();

    // Log incoming request
    logRequest(request);

    return next.handle().pipe(
      tap(() => {
        // Log response when request completes
        logResponse(request, response, startTime);
      }),
    );
  }
}
