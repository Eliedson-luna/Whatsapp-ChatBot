const { BaseAttendant } = require("../../base/baseAttendant");

export class Comercial extends BaseAttendant{
    numeroAttendant = process.env.NUM_COMERCIAL;

    constructor(userMsg: any, userId: any) {
        super(userMsg, userId);
        
    }
  
}