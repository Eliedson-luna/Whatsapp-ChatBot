import { BotClient } from "./client/botclient";
import { Session } from "./models/chatSession/session/session";
const { getContactName } = require('./client/functions/contact/getContactName')
const { mainMenu, processChoice } = require('./client/components/menu/mainMenu')
const { startTyping } = require('./client/functions/chat/startTyping')

require('dotenv').config();


// ───── CONFIG ─────
const client: any = BotClient.getInstance().client
const initializedAt = Date.now();
const sessionManager = Session.getInstance();

// ───── BOT ─────
client.on('message', async (msg: any) => {
  const messageTime = msg.timestamp * 1000 // Quando a mensagem foi recebida, em milisegundos
  const isCliente = msg.from.endsWith('@c.us');                           
  if (!isCliente) return
  
  if (new Date(messageTime - initializedAt).getMinutes() == 0) { return } // Impede o bot de interagir com pessoas que mandaram 
                                                                          // mensagens 30 minutos antes de sua inicialização
  const processingTime = Date.now();
  const userId = msg.from;
  const session = sessionManager.getSession(userId);

  if (!session.inService()) {
    await client.sendMessage(
      userId,
      "Olá, Bem vindo à *Laticínios Sensação de minas*!\n\n😢 Desculpe, mas não posso te atender agora\nNossos horários de atendimento são:\n\nde *Segunda* a *Sexta*\nde *07:00* às *11:00* e *14:00* às *17:00*")
    return
  }

  const text = msg.body.trim().toLowerCase();

  // resetar inatividade
  if (session.timeout()) clearTimeout(session.timeout()!);

  const timer = setTimeout(async () => {
    if (!session.acceptingClientInteraction()) {
      await client.sendMessage(
        userId,
        'Deseja mais alguma coisa?'
      );
      session.setLastMenu(0);
      session.unblockClient()
    }
    else {
      await client.sendMessage(
        userId,
        '👋 Sem respostas há um tempo, vou encerrar seu atendimento. Qualquer coisa é só dar um alô!!'
      );
      sessionManager.deleteSession(userId);
    }
  }, session.INACTIVITY_TIMEOUT);

  session.setUserTimeout(timer);

  // ─── Modo Espera ───
  if (session.isWaitingAttendant()) {
    if (text === 'menu') {
      session.notWaitAttendant();
      session.setLastMenu(0);
      if (!session.acceptingClientInteraction()) { session.unblockClient() }
    } else if (text === 'finalizar') {
      await client.sendMessage(userId, "👋 Finalizando atendimento\nSensação de Minas agradece seu contato!");
      sessionManager.deleteSession(userId);
      return
    }
    else {
      await client.sendMessage(
        userId,
        '🤔 Não era o que procurava?\n\nPara escolher uma nova opção envie: *Menu*\n\nPara finalizar seu atendimento envie: *Finalizar*')
      return;
    }
  }
  if (!session.acceptingClientInteraction()) { return }
  // ─── SAUDAÇÃO / MENU ───

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
      session.menuActive();
      return
    }
  }
  if (session.isMenuActive()) {
    await processChoice(session, msg);
  }
  console.log(sessionManager.sessions)
});

