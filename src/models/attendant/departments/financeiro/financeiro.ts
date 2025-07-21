const { BaseAttendant } = require("../../base/baseAttendant");

export class Financeiro extends BaseAttendant {
    numeroAttendant = process.env.NUM_FINAN;
    constructor(userMsg: any, userId: any) {
        super(userMsg, userId);
    }
}