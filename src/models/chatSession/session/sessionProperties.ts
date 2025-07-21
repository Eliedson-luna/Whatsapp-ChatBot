import { ISessionProperties } from "../../../interfaces/isessionProperties";

export class SessionProperties implements ISessionProperties {
    userId: string;
    private lastMenu: number = 0;
    private inactivityTimer: NodeJS.Timeout | null = null;
    private waitingAttendant: boolean = false;

    public INACTIVITY_TIMEOUT = 10 * 60 * 1000;
    public MENU_COOLDOWN = 60 * 60 * 1000;

    constructor(userId: string) { this.userId = userId }


    getLastMenu() {
        return this.lastMenu;
    }
    timeout() {
        return this.inactivityTimer;
    }
    isWaiting() {
        return this.waitingAttendant;
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



}