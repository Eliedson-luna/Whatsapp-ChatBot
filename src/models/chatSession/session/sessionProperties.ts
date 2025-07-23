import { ISessionProperties } from "../../../interfaces/isessionProperties";

export class SessionProperties implements ISessionProperties {
    readonly userId: string;
    private lastMenu: number = 0;
    private inactivityTimer: NodeJS.Timeout | null = null;
    private waitingAttendant: boolean = false;
    private menuActiveStatus = false
    protected acceptClientInteraction = true;
    readonly INACTIVITY_TIMEOUT = 1 * 60 * 1000; // 10 minutes
    readonly MENU_COOLDOWN = 60 * 60 * 1000; // 1 hour
    readonly createdAt = Date.now();

    constructor(userId: string) { this.userId = userId; }

    getLastMenu(): number {
        return this.lastMenu;
    }
    timeout(): NodeJS.Timeout | null {
        return this.inactivityTimer;
    }
    isWaitingAttendant(): boolean {
        return this.waitingAttendant;
    }
    isMenuActive(): boolean {
        return this.menuActiveStatus;
    }
    setLastMenu(menuState: number): void {
        try {
            this.lastMenu = menuState;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.setLastMenu()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao setar estado do menu.")
            }
        }
    }
    setUserTimeout(timeout: NodeJS.Timeout | null): void {
        try {
            this.inactivityTimer = timeout;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.setUserTimeout()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao setar timeout de inatividade.")
            }
        }
    }
    waitAttendant(): void {
        try {
            this.waitingAttendant = true;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.waitAttendant()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao mudar estado de espera.")
            }
        }
    }
    notWaitAttendant(): void {
        try {
            this.waitingAttendant = false;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.notWaitAttendant()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao mudar estado de espera.")
            }
        }
    }
    menuActive(): void {
        try {
            this.menuActiveStatus = true;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.menuActive()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao ativar menu.")
            }
        }
    }
    menuDeactive(): void {
        try {
            this.menuActiveStatus = false;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.menuDeactive()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao desativar menu.")
            }
        }
    }
    inService(): boolean {
        try {
            const processingDay = new Date().getDay();
            const processingHour = new Date().getHours();
            if (
                (processingHour < 7 || processingHour > 11)
                &&
                (processingHour < 13 || processingHour >= 17)
                ||
                (processingDay == 0 || processingDay == 6)) {
                return false
            } else {
                return true
            }
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.inService()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao desativar menu.")
            }
        }
    }
    acceptingClientInteraction(): boolean {
        try {
            return this.acceptClientInteraction;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.acceptingCLientInteraction()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao consultar se a sessão está bloqueando o client.")
            }
        }
    }
    blockClient(): void {
        try {
            this.acceptClientInteraction = false;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.bloqClient()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao bloquear client.")
            }
        }
    }
    unblockClient(): void {
        try {
            this.acceptClientInteraction = true;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.unBloqClient()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao bloquear client.")
            }
        }
    }
}