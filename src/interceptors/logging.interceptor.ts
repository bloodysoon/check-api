import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RouteDebug');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();
    const { method, originalUrl } = req;
    const start = Date.now();

    this.logger.log(`--> ${method} ${originalUrl}`);

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          this.logger.log(`<-- ${method} ${originalUrl} ${res.statusCode} +${ms}ms`);
        },
        error: (err) => {
          const ms = Date.now() - start;
          this.logger.error(`xxx ${method} ${originalUrl} ${res.statusCode} +${ms}ms: ${err?.message}`);
        },
      }),
    );
  }
}
