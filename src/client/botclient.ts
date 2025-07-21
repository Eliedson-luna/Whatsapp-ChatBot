const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');


export class BotClient {
    private static instance: BotClient;
    public client
    
    private constructor() {
        this.client = this.createClient();
    }

    public static getInstance(): BotClient {
        if (!BotClient.instance) {
            BotClient.instance = new BotClient();
        }
        return BotClient.instance
    }

    createClient() {
        try {
            const client = new Client({
                authStrategy: new LocalAuth(),
                puppeteer: { headless: true }
            });

            client.on('qr', (qr: any) => qrcode.generate(qr, { small: true }));
            client.on('ready', () => console.log('WHATSAPP CONECTADO COM SUCESSO'));
            client.initialize();
            return client
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Nome: error.name, Mensagem: error.message })
                console.error(erro)
            } else {
                console.error("Erro desconhecido ao inicializar client.")
            }
        }
    }

}
