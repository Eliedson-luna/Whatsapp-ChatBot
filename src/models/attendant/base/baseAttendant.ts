import { BotClient } from "../../../client/botclient";
import { IAttendant } from "../../../interfaces/iattendant";
import { AppError } from "../../error/appError";

const client: any = BotClient.getInstance().client

export class Attendant implements IAttendant {
    protected cellNumber: string;
    protected customerName: any
    protected userId: string = ''

    constructor(cellNumber: string) {
        this.cellNumber = cellNumber;
    }
    setCustomerName(custumerName: string) {
        this.customerName = custumerName
    }
    setUserId(id: string) {
        this.userId = id
    }
    getNumber() {
        return this.cellNumber;
    }

    async notifyAttendant() {
        try {
            await notify(this.customerName, this.userId, this.cellNumber)
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            if (error instanceof Error) {
                throw new AppError('BaseAttendant.notifyAttendant()', error);
            } else {
                throw new Error("Erro desconhecido ao enviar notificação.")
            }
        }
    }

    async sendLink() {
        try {
            await client.sendMessage(this.userId, 'Aqui está!\nSiga o link para iniciar uma conversa com o responsável.' + `\n\nhttps://wa.me/${this.cellNumber.replace('@c.us', '')}`);
        } catch (error) {
            if (error instanceof Error) {
                throw new AppError('BaseAttendant.sendLink()', error);
            } else {
                throw new Error("Erro desconhecido ao enviar link.")
            }
        }
    }
}

async function notify(customerName: string, userId: string, number: string) {
    try {
        const name = customerName || 'Cliente sem nome';

        const cellNumber = userId.replace('@c.us', '');

        await client.sendMessage(userId, 'Só um instante, vou chamar o recepcionista para te atender.\n\nCaso ninguém envie mensagem no chat nos próximos 10 minutinhos, eu retorno para acompanhar, tudo bem? 😊');
        await client.sendMessage(
            number,
            `❗*Novo Atendimento*❗\n\n` +
            `Solicitante: ${name}\n` +
            `Clique para atender: https://wa.me/${cellNumber}`
        );
    } catch (error) {
        if (error instanceof Error) {
            throw new AppError('BaseAttendant.notify()', error);
        } else {
            throw new Error("Erro desconhecido ao enviar notificação.")
        }
    }
}

