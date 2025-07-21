const { BaseAttendant } = require('../../base/baseAttendant');

export class Recepcao extends BaseAttendant {
    numeroAttendant = process.env.NUM_RECEPCAO;
    constructor(userMsg: any, userId: any) {
        super(userMsg, userId);
    }
}