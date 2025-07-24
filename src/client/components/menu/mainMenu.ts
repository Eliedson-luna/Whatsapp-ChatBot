import { Session } from "../../../models/chatSession/session/session";
import { SessionProperties } from "../../../models/chatSession/session/sessionProperties";
import { BotClient } from "../../botclient";
const { startTyping } = require('../../functions/chat/startTyping')
const { Recepcao } = require("../../../models/attendant/departments/recepcao/recepcao");
const { Captacao } = require("../../../models/attendant/departments/captacao/captacao");
const { Cobranca } = require("../../../models/attendant/departments/cobranca/cobranca");
const { Comercial } = require("../../../models/attendant/departments/comercial/comercial");
const { Compras } = require("../../../models/attendant/departments/compras/compras");
const { Financeiro } = require("../../../models/attendant/departments/financeiro/financeiro");
const { getContactName } = require('../../functions/contact/getContactName')

const client: any = BotClient.getInstance().client;
const sessionManager = Session.getInstance();

const options = { 1: 'Captação ', 2: 'Cobrança', 3: 'Comercial', 4: 'Compras', 5: 'Financeiro', 6: 'Solicitar recepcionista', 7: 'Sair' }

const optionFilters: { [key: number]: RegExp } = {
  1: /^(1|um|primeiro|captacao|captação|capta|captacão|captaçao)$/i,
  2: /^(2|dois|segundo|cobranca|cobrança|cobrar|boleto)$/i,
  3: /^(3|tres|três|comercial|vendas|vendedor)$/i,
  4: /^(4|quatro|compras|compra|produto|estoque)$/i,
  5: /^(5|cinco|financeiro|fatura|pagamento|contas)$/i,
  6: /^(6|seis|atendente|adentende|atindente|atendente)$/i,
  7: /^(7|sair|cancelar|cancel|cancela|finalizar)$/i
};

function mainMenu(customerName: string, lastmenu: number, createdAt: number) {
  const menu =
    `${lastmenu == createdAt ? `Olá, ${customerName}! Bem‑vindo à *Laticínios Sensação de Minas* !\n` : ''}`
    + `Para falar com algum setor selecione uma das opções:\n` +
    `\n1️⃣ ${options[1]}  🥛` +
    `\n2️⃣ ${options[2]}   💰` +
    `\n3️⃣ ${options[3]}  📦` +
    `\n4️⃣ ${options[4]}    🛒` +
    `\n5️⃣ ${options[5]}  📊` +
    `\n6️⃣ ${options[6]} 🤵🤵‍♀` +
    `\n7️⃣ ${options[7]} ❌` +
    `${lastmenu == createdAt ? '\n\nObs.: Você pode me chamar a qualquer momento digitando "Menu" no chat 😉' : ''}`
  return menu
}


async function processChoice(session: SessionProperties, msg: any) {
  let selectedOption: number | null = null;

  const customerName = await getContactName(msg);

  const text = msg.body.trim().toLowerCase();

  for (const [key, regex] of Object.entries(optionFilters)) {
    if (regex.test(text)) {
      selectedOption = Number(key);
      break;
    }
  }

  const handlers: Record<number, () => void> = {
    1: () => { new Captacao(customerName, session.userId).sendLink(); },
    2: () => { new Cobranca(customerName, session.userId).sendLink(); },
    3: () => { new Comercial(customerName, session.userId).sendLink() },
    4: () => { new Compras(customerName, session.userId).sendLink(); },
    5: () => { new Financeiro(customerName, session.userId).sendLink(); },
    6: () => { new Recepcao(customerName, session.userId).notifyAttendant(); },
    7: async () => {
      await client.sendMessage(session.userId, "👋 Finalizando atendimento\nSensação de Minas agradece seu contato!");
      sessionManager.deleteSession(session.userId);
    }
  }

  try {
    const handler = handlers[selectedOption!];
    if (handler) {
      await startTyping(msg);
      if (selectedOption == 6) {
        await handler();
        session.menuDeactive();
        session.blockClient()
        return
      }
      handler();
      session.menuDeactive();
      session.waitAttendant();
    } else {
      await client.sendMessage(
        session.userId,
        '🤔 Não entendi.\nPor favor, escolha uma das opções do menu.'
      );
    }

  } catch (error) {
    if (error instanceof Error) {
      const erro = JSON.stringify({ Nome: error.name, Mensagem: error.message })
      console.error(erro)
    } else {
      console.error("Erro desconhecido ao processar escolha do cliente.")
    }
  }
}

module.exports = { mainMenu, processChoice };