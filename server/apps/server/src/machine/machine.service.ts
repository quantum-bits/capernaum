import { Injectable } from "@nestjs/common";
import { BaseService } from "../shared/base.service";

@Injectable()
export class MachineService extends BaseService {
  constructor() {
    super();
  }
}
