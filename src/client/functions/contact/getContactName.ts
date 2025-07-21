const getContactName = async (msg: any) => {
    try {
        const contact = await msg.getContact();
        const nome = contact.pushname.split(' ')[0] || 'cliente';
        return nome
    } catch (error) {
        if (error instanceof Error) {
            const erro = JSON.stringify({ Nome: error.name, Mensagem: error.message })
            console.error(erro)
        } else {
            console.error("Erro desconhecido ao capturar o nome do cliente.")
        }
    }
}


module.exports = { getContactName };