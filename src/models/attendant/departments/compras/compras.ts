const { BaseAttendant } = require("../../base/baseAttendant");

export class Compras extends BaseAttendant{
    numeroAttendant = process.env.NUM_COMPRAS;

    constructor(userMsg: any, userId: any) {
        super(userMsg, userId);
        
    }
  
}