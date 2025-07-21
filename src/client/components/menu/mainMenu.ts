import { SessionProperties } from "../../../models/chatSession/session/sessionProperties";
import { BotClient } from "../../botclient";
import { Recepcao } from "../../../models/attendant/departments/recepcao/recepcao";

const { Captacao } = require("../../../models/attendant/departments/captacao/captacao");
const { Cobranca } = require("../../../models/attendant/departments/cobranca/cobranca");
const { Comercial } = require("../../../models/attendant/departments/comercial/comercial");
const { Compras } = require("../../../models/attendant/departments/compras/compras");
const { Financeiro } = require("../../../models/attendant/departments/financeiro/financeiro");

const client: any = BotClient.getInstance().client


const options = { 1: 'Captação ', 2: 'Cobrança', 3: 'Comercial', 4: 'Compras', 5: 'Financeiro', 6: 'Falar com a recepção' }

const optionFilters: { [key: number]: RegExp } = {
  1: /^(1|um|primeiro|captacao|captação|capta|captacão|captaçao)$/i,
  2: /^(2|dois|segundo|cobranca|cobrança|cobrar|boleto)$/i,
  3: /^(3|tres|três|comercial|vendas|vendedor)$/i,
  4: /^(4|quatro|compras|compra|produto|estoque)$/i,
  5: /^(5|cinco|financeiro|fatura|pagamento|contas)$/i,
  6: /^(6|seis|atendente|adentende|atindente|atendente)$/i
};

const mainMenu = (customerName: string, lastmenu: number) => {
  const menu =
    `Olá, ${customerName}! Bem‑vindo à *Laticínios Sensação de Minas* !
    \nSelecione uma das opções para falar com o setor desejado:` +
    `\n1️⃣ ${options[1]} 🐄` +
    `\n2️⃣ ${options[2]} 💰` +
    `\n3️⃣ ${options[3]} 📦` +
    `\n4️⃣ ${options[4]} 🛒` +
    `\n5️⃣ ${options[5]} 📊` +
    `\n5️⃣ ${options[6]} 🤵🤵‍♀` +
    `${lastmenu == 0 ? '\n\nObs.: Você pode me chamar a qualquer momento digitando "Menu" no chat 😉' : ''}`
  return menu
}

async function processChoice(customerName: string, text: string, session: SessionProperties) {
  let selectedOption: number | null = null;

  for (const [key, regex] of Object.entries(optionFilters)) {
    if (regex.test(text)) {
      selectedOption = Number(key);
      break;
    }
  }

  try {
    switch (selectedOption) {
      case 1: {
        try {
          new Captacao(customerName, session.userId).sendLink();
          session.waiting();
          return;
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("Erro desconhecido ao tratar escolha.")
          }
        }
      }
      case 2: {
        try {
          new Cobranca(customerName, session.userId).sendLink();
          session.waiting();
          return
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("Erro desconhecido ao tratar escolha.")
          }
        }

      }
      case 3: {
        try {
          new Comercial(customerName, session.userId).sendLink();
          session.waiting();
          return
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("Erro desconhecido ao tratar escolha.")
          }
        }
      }

      case 4: {
        try {
          new Compras(customerName, session.userId).sendLink();
          session.waiting();
          return
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("Erro desconhecido ao tratar escolha.")
          }
        }
      }

      case 5: {
        try {
          new Financeiro(customerName, session.userId).sendLink();
          session.waiting();
          return
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("Erro desconhecido ao tratar escolha.")
          }
        }
      }

      case 6: {
        try {
          new Recepcao(customerName, session.userId).notifyAttendant();
          session.waiting();
          return
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          } else {
            console.error("Erro desconhecido ao tratar escolha.")
          }
        }
      }

      default:
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