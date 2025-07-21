import { BotClient } from "../../../client/botclient";
import { Attendant } from "../../../interfaces/iattendant";

const client: any = BotClient.getInstance().client

export class BaseAttendant implements Attendant {
    protected numeroAttendant!: any; // Need to pass the attendant number by a CONFIG or a .env file
    protected customerName: any
    protected userId: string

    constructor(customerName: string, userId: string) {
        this.customerName = customerName;
        this.userId = userId
    }

    getNumber() {
        return this.numeroAttendant;
    }

    async notifyAttendant() {
        try {
            await notify(this.customerName, this.userId, this.numeroAttendant)
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'BaseAttendant.notifyAttendant()',ErrorName: error.name, Message: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao enviar notificação.")
            }
        }
    }

    async sendLink() {
        try {
            await client.sendMessage(this.userId, 'Siga o link para iniciar uma conversa com o atentende.' + `\n\nhttps://wa.me/${this.numeroAttendant.replace('@c.us', '')}`);
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'BaseAttendant.sendLink()',ErrorName: error.name, Message: error.message })
                console.error(erro)
            } else {
                console.error("Erro desconhecido ao enviar link.")
            }
        }
    }

}

async function notify(customerName: string, userId: string, number: string) {
    try {
        const name = customerName || 'Cliente sem nome';

        const telefone = userId.replace('@c.us', '');

        await client.sendMessage(userId, 'Aguarde um istante, um de nossos colaboradores entrará em contato com você.');
        await client.sendMessage(
            number,
            `❗*Novo Atendimento*❗\n\n` +
            `Solicitante: ${name}\n` +
            `Clique para atender: https://wa.me/${telefone}`
        );
    } catch (error) {
        if (error instanceof Error) {
            const erro = JSON.stringify({ Nome: error.name, Mensagem: error.message })
            throw new Error(erro)
        } else {
            throw new Error("Erro desconhecido ao enviar notificação.")
        }
    }
}

