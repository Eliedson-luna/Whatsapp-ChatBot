import { BotClient } from "./client/botclient";
import { Session } from "./models/chatSession/session/session";
const { getContactName } = require('./client/functions/contact/getContactName')
const { mainMenu, processChoice } = require('./client/components/menu/mainMenu')
const { startTyping } = require('./client/functions/chat/startTyping')

require('dotenv').config();


// ───── CONFIG ─────
const client: any = BotClient.getInstance().client

const sessionManager = Session.getInstance();

// ───── BOT ─────
client.on('message', async (msg: any) => {
  const isCliente = msg.from.endsWith('@c.us');
  if (!isCliente) return

  const processingTime = Date.now();
  const userId = msg.from;
  const session = sessionManager.getSession(userId);

  if (!session.inService()) {
    await client.sendMessage(
      userId,
      "Olá, Bem vindo à Laticínios Sensação de minas!\n😢 Desculpe, mas não posso te atender agora\nNossos horários de atendimento são:\nde *Segunda* a *Sexta*\nde *07:00* às *11:00* e *14:00* às *17:00*")
    return
  }

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
    if (text === 'menu') {
      session.notWaiting();
      session.setLastMenu(0);
    } else if (text === 'finalizar') {
      await client.sendMessage(userId, "Finalizando atendimento");
      sessionManager.deleteSession(userId);
      return
    }
    else {
      await client.sendMessage(
        userId,
        'Não era o que procurava?\nEnvie:\n\n *Menu*, para escolher uma nova opção\n\n *Finalizar*, para finalizar seu atendimento')
      return;
    }
  }


  // ─── SAUDAÇÃO / MENU ───
  // const saudacaoRegex = /^(menu|oi|olá|ola|opa|oie|bom dia|boa tarde|boa noite|olá|site|anúncio|anúncio)$/i;
  const firstName = await getContactName(msg);
  if (text) {
    // anti‑spam de menu
    if (!(processingTime - session.getLastMenu() < session.MENU_COOLDOWN)) {
      session.setLastMenu(processingTime);
      await startTyping(msg);
      await client.sendMessage(
        userId,
        mainMenu(firstName, session.getLastMenu(), session.createdAt)
      );
      session.activateMenu();
      return
    }
  }
  if (session.isMenuActive()) {
    await processChoice(firstName, text, session, msg);
  }
  console.log(sessionManager.sessions)
}

);

