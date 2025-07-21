const { BaseAttendant } = require("../../base/baseAttendant");

export class Captacao extends BaseAttendant {
    numeroAttendant = process.env.NUM_CAPTA;

    constructor(userMsg: any, userId: any) {
        super(userMsg, userId);
    }

}