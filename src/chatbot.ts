import { BotClient } from "./client/botclient";
import { Session } from "./models/chatSession/session/session";
const { getContactName } = require('./client/functions/contact/getContactName')
const { mainMenu, processChoice } = require('./client/components/menu/mainMenu')

require('dotenv').config();


// ───── CONFIG ─────
const client: any = BotClient.getInstance().client

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const sessionManager = Session.getInstance();

// ───── BOT ─────
client.on('message', async (msg: any) => {
  const isCliente = msg.from.endsWith('@c.us');
  if (isCliente) {
    const userId = msg.from;
    const session = sessionManager.getSession(userId);

    const text = msg.body.trim().toLowerCase();

    // resetar inatividade
    if (session.timeout()) clearTimeout(session.timeout()!);

    const timer = setTimeout(async () => {
      await client.sendMessage(
        userId,
        '👋 Sem respostas há um tempo, vou encerrar seu atendimento. Qualquer coisa é só dar um alô!!'
      );
      sessionManager.deleteSession(userId);
    }, session.INACTIVITY_TIMEOUT);

    session.setTimeout(timer);

    // ─── Modo Espera ───
    if (session.isWaiting()) {
      if (text === 'cancelar') {
        session.notWaiting();
        session.setLastMenu(0);
      }
      if (text === 'finalizar') {
        client.sendMessage(userId, "Finalizando atendimento");
        sessionManager.deleteSession(userId);
      }
      else {
        client.sendMessage(userId, 'Não era o que procurava? Envie:\n*Cancelar*, para escolher uma nova opção\n*Finalizar*, para finalizar seu atendimento')
        return;
      }
    }

    // ─── SAUDAÇÃO / MENU ───
    const saudacaoRegex = /^(menu|oi|olá|ola|opa|oie|bom dia|boa tarde|boa noite|Olá|site|Anúncio|anúncio)$/i;
    const firstName = await getContactName(msg);
    if (saudacaoRegex.test(text)) {
      // anti‑spam de menu
      if (Date.now() - session.getLastMenu() < session.MENU_COOLDOWN) return;

      session.setLastMenu(Date.now());
      const chat = await msg.getChat();
      await chat.sendStateTyping();
      await delay(2000);

      await client.sendMessage(
        userId,
        mainMenu(firstName, session.getLastMenu())
      );
      return;
    }
    await processChoice(firstName, text, session);

    console.log(sessionManager.sessions)
  }

});
