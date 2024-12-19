import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common"
import { plainToInstance } from "class-transformer"
import { Observable } from "rxjs"
import { map } from "rxjs/operators"

interface ClassConstructor {
  // biome-ignore lint/complexity/noBannedTypes: <explanation>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  new (...args: any[]): {}
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto))
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  intercept(ctx: ExecutionContext, handler: CallHandler): Observable<any> {
    // Mess with req

    return handler.handle().pipe(
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      map((data: any) => plainToInstance(this.dto, data, { excludeExtraneousValues: true })),
    )
  }
}
