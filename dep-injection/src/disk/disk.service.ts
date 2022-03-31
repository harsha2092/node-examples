import { Injectable } from '@nestjs/common';
import { PowerService } from 'src/power/power.service';

@Injectable()
export class DiskService {
    constructor(public powerService: PowerService){

    }

    accessData(){
        console.log('using 5 watts of powersupply from power service');
        this.powerService.supplyPower(5);
        return "data";
    }
}
