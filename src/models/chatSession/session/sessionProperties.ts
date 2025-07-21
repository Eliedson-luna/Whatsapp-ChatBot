import { ISessionProperties } from "../../../interfaces/isessionProperties";

export class SessionProperties implements ISessionProperties {
    userId: string;
    private lastMenu: number = 0;
    private inactivityTimer: NodeJS.Timeout | null = null;
    private waitingAttendant: boolean = false;
    private menuActiveStatus = false
    public INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes
    public MENU_COOLDOWN =  60 * 60 * 1000; // 1 hour

    constructor(userId: string) { this.userId = userId; }

    getLastMenu() {
        return this.lastMenu;
    }
    timeout() {
        return this.inactivityTimer;
    }
    isWaiting() {
        return this.waitingAttendant;
    }

    isMenuActive() {
        return this.menuActiveStatus;
    }

    setLastMenu(menuState: number) {
        try {
            this.lastMenu = menuState;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao setar estado do menu.")
            }
        }
    }
    setTimeout(timeout: NodeJS.Timeout | null) {
        try {
            this.inactivityTimer = timeout;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao setar timeout de inatividade.")
            }
        }
    }
    waiting() {
        try {
            this.waitingAttendant = true;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao mudar estado de espera.")
            }
        }
    }
    notWaiting() {
        try {
            this.waitingAttendant = false;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao mudar estado de espera.")
            }
        }
    }
    activateMenu() {
        try {
            this.menuActiveStatus = true;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.activateMenu()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao ativar menu.")
            }
        }
    }
    deactivateMenu() {
        try {
            this.menuActiveStatus = false;
        } catch (error) {
            if (error instanceof Error) {
                const erro = JSON.stringify({ Location: 'sessionProperties.deactivateMenu()', Nome: error.name, Mensagem: error.message })
                throw new Error(erro)
            } else {
                throw new Error("Erro desconhecido ao desativar menu.")
            }
        }
    }



}