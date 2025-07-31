import { allAttendants } from "../../../config/config";
import { callAttendant } from "../../../DAO/attendant/attendantDAO";
import { Session } from "../../../models/chatSession/session/session";
import { SessionProperties } from "../../../models/chatSession/session/sessionProperties";
import { BotClient } from "../../botclient";
const { startTyping } = require('../../functions/chat/startTyping')
const { getContactName } = require('../../functions/contact/getContactName');

async function mainMenu(customerName: string, session: SessionProperties) {
  const attendants = await allAttendants();
  const isFirstMenu = session.getLastMenu() === session.createdAt;

  const header = isFirstMenu
    ? `Olá, ${customerName}!Seja Bem‑vindo à *Laticínios Sensação de Minas*! \nÉ um prazer ter você por aqui!\n\n`
    : '';

  const options =
    attendants.length > 0
      ? attendants
        .map((a: any) => `${a.id} - ${a.name}`)
        .join(`\n`)
      : 'Nenhum atendente disponível no momento.';

  const footer = isFirstMenu
    ? '\n\nObs.: Você pode me chamar a qualquer momento digitando "Menu" no chat 😉'
    : '';

  const menu =
    `${header}` +
    `Para falar com algum setor selecione uma das opções:\n` +
    `${options}` +
    `${footer}`;

  return menu;
}

let repeats = 0;
async function processChoice(session: SessionProperties, msg: any) {
  const sessionManager = Session.getInstance();
  const client: any = BotClient.getInstance().client;
  const customerName = await getContactName(msg);
  const text = msg.body.trim().toLowerCase();

  const attendants = await allAttendants();
  const matched = attendants.find((att: any) =>
    att.keywords.some((k: string) => new RegExp(`^${k}$`, 'i').test(text))
  );

  if (!matched) {
    if (repeats === 3) return;
    await client.sendMessage(
      session.userId,
      '🤔 Não entendi.\nPor favor, escolha uma das opções do menu.'
    );
    repeats++;
    return;
  }

  try {
    await startTyping(msg);
    session.menuDeactive();
    session.waitAttendant();
    repeats = 0;

    if (matched.method === 'exit' || matched.name.toLowerCase() === 'sair') {
      await client.sendMessage(
        session.userId,
        "👋 Finalizando atendimento\nSensação de Minas agradece seu contato!"
      );
      sessionManager.deleteSession(session.userId);
    } else if (
      matched.name.toLowerCase() === 'recepcao'
      ||
      matched.name.toLowerCase() === 'recepcão'
      ||
      matched.name.toLowerCase() === 'recepção'
      ||
      matched.name.toLowerCase() === 'recepçao'
      ||
      matched.name.toLowerCase() === 'atendente'
    ) {
      await callAttendant(matched.id, customerName, session.userId);
      session.blockClient();
    }
    else {
      await callAttendant(matched.id, customerName, session.userId);
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : error);
  }
}


module.exports = { mainMenu, processChoice };