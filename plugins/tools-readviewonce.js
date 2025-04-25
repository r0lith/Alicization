let { downloadContentFromMessage } = await import('@whiskeysockets/baileys');

var handler = async (m, { conn }) => {
  try {
    if (!m.quoted) throw '✳️❇️ No quoted message found!';
    
    // Log the quoted message for debugging
    console.log('Quoted Message:', m.quoted);

    // Check if the message is a "view once" message
    if (!/viewOnce/.test(m.quoted.mtype)) {
      console.log('Message Type:', m.quoted.mtype); // Log the message type for debugging
      throw '✳️❇️ It\'s not a ViewOnce message!';
    }

    let mtype = Object.keys(m.quoted.message)[0];
    console.log('Message Type Key:', mtype); // Log the message type key for debugging

    let buffer = await m.quoted.download();
    let caption = m.quoted.message[mtype]?.caption || '';

    await conn.sendMessage(
      m.chat,
      { [mtype.replace(/Message/, '')]: buffer, caption },
      { quoted: m }
    );
  } catch (err) {
    console.error('Error processing ViewOnce message:', err);
    throw err; // Re-throw the error to notify the user
  }
};

handler.help = ['readvo'];
handler.tags = ['tools'];
handler.command = ['readviewonce', 'read', 'vv', 'readvo'];

export default handler;