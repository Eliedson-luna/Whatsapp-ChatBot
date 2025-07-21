const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function startTyping(msg: any) {
    const chat = await msg.getChat();
    await chat.sendStateTyping();
    await delay(2000);
}

module.exports = { startTyping }