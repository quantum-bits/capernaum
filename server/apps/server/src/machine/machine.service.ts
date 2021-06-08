import { Injectable } from "@nestjs/common";
import { OldBaseService } from "../shared/old-base.service";

@Injectable()
export class MachineService extends OldBaseService {
  constructor() {
    super();
  }
}
