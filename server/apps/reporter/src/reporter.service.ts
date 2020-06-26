import { Injectable } from '@nestjs/common';

@Injectable()
export class ReporterService {
  getHello(): string {
    return 'Hello World!';
  }
}
