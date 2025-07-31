
import { ChromiumManager } from "../chromium/chromium";

const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');


export class BotClient {
    private static instance: BotClient;
    public client: any;
    private chromiumPath: string = '';

    private constructor() {
    }

    public static getInstance(): BotClient {
        if (!BotClient.instance) {
            BotClient.instance = new BotClient();
        }
        return BotClient.instance
    }

    public async initialize(): Promise<void> {
        try {
            console.log('🚀 Inicializando SensacaoBot...');

            // 1. Garante que o Chromium existe
            console.log('🔍 Configurando Chromium...');
            this.chromiumPath = await ChromiumManager.ensureChromium();

            // 2. Cria o client com o caminho do Chromium
            console.log('📱 Criando cliente WhatsApp...');
            this.client = await this.createClient();

            console.log('✅ Bot inicializado com sucesso!');

        } catch (error) {
            console.error('❌ Erro ao inicializar bot:', error);
            throw error;
        }
    }

    private async createClient(): Promise<any> {
        try {
            const client = new Client({
                authStrategy: new LocalAuth({
                    dataPath: './.wwebjs_auth'
                }),
                puppeteer: {
                    headless: true,
                    executablePath: this.chromiumPath, // Usa o Chromium baixado
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--disable-dev-shm-usage',
                        '--disable-accelerated-2d-canvas',
                        '--no-first-run',
                        '--no-zygote',
                        '--disable-gpu',
                        '--disable-web-security',
                        '--disable-features=VizDisplayCompositor',
                        '--disable-background-timer-throttling',
                        '--disable-backgrounding-occluded-windows',
                        '--disable-renderer-backgrounding'
                    ]
                }
            });

            // Event listeners
            client.on('qr', (qr: string) => {
                console.log('📱 Escaneie o QR Code:');
                qrcode.generate(qr, { small: true });
            });

            client.on('ready', () => {
                console.log('✅ WHATSAPP CONECTADO COM SUCESSO');
            });

            client.on('auth_failure', (msg: any) => {
                console.error('❌ Falha na autenticação:', msg);
            });

            client.on('disconnected', (reason: any) => {
                console.log('⚠️ Cliente desconectado:', reason);
            });

            client.on('loading_screen', (percent: number, message: string) => {
                console.log('📱 Carregando WhatsApp...', `${percent}%`, message);
            });

            // Inicializa o client
            await client.initialize();

            return client;

        } catch (error) {
            const erro = {
                Location: 'BotClient.createClient()',
                Nome: error instanceof Error ? error.name : 'UnknownError',
                Mensagem: error instanceof Error ? error.message : 'Erro desconhecido',
                ChromiumPath: this.chromiumPath
            };
            console.error('❌ Erro ao criar client:', JSON.stringify(erro, null, 2));
            throw error;
        }
    }

    public isReady(): boolean {
        return this.client && this.client.info;
    }

    // Método para obter informações do cliente
    public getClientInfo(): any {
        return this.client ? this.client.info : null;
    }

    // Método para destruir o client
    public async destroy(): Promise<void> {
        if (this.client) {
            await this.client.destroy();
            console.log('🔄 Cliente WhatsApp finalizado');
        }
    }

}
