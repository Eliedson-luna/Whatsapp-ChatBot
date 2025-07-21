const { BaseAttendant } = require("../../base/baseAttendant");

export class Cobranca extends BaseAttendant {
    numeroAttendant = process.env.NUM_COBRANCA;
    constructor(userMsg: any, userId: any) {
        super(userMsg, userId);
    }
}