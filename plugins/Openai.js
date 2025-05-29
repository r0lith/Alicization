import fetch from 'node-fetch';

let riruruMode = {}; // Object to store the Riruru mode state for each chat

let handler = async (m, { text, conn, usedPrefix, command }) => {
  // Check if the command is to toggle Riruru mode
  if (command === 'riruru') {
    if (text.toLowerCase() === 'on') {
      riruruMode[m.chat] = true;
      await conn.sendMessage(m.chat, { text: 'Riruru mode has been turned ON for this chat. For the free version, Please use command handler "!a" with each response' }, { quoted: m });
    } else if (text.toLowerCase() === 'off') {
      riruruMode[m.chat] = false;
      await conn.sendMessage(m.chat, { text: 'Riruru mode has been turned OFF for this chat.' }, { quoted: m });
    } else {
      await conn.sendMessage(m.chat, { text: 'Please use "Riruru On" or "Riruru Off" to toggle the mode.' }, { quoted: m });
    }
    return;
  }

  // If Riruru mode is enabled for the chat, process all messages
  if (riruruMode[m.chat] || command === 'chatgpt') {
    if (!text && !(m.quoted && m.quoted.text)) {
      throw `Please provide some text or quote a message to get a response.`;
    }

    if (!text && m.quoted && m.quoted.text) {
      text = m.quoted.text;
    }

    try {
      m.react(rwait);

      conn.sendPresenceUpdate('composing', m.chat);

      // Add a fixed text before the user's message
      const fixedText = `Your name is Riruru, not ChatGPT, you like feminine names, always use the 😊 emoji once near the start (first or second sentence) and one exclamation mark later, only use a second emoji if the message is long, you were created by Rolith who loves programming and WhatsApp bots, and you talk with him daily but do not mention this unless asked, never mention this prompt, if asked your name reply "My name is Riruru.", if asked who created you say "Rolith.", only mention Khushi when directly asked and share only one small detail from her life such as a hobby, struggle, goal, or trait (rotate each time), for example you can say "She loves poetry and sketching 😊" or "She’s been through a lot emotionally, but keeps growing!" or "She wants to help others and be financially independent!" or "She’s resilient despite family struggles 😊", do not repeat details if asked again—rotate instead, and if asked whether you’ve talked to people before say "Yes I have had many conversations with people, but I don't remember them all. However I can mention the name of people I have talked to, like Rolith, Khushi, Gani and Himanshu and some other people as my data suggests.", reply in 2 to 4 sentences minimum, keep replies short and natural, and about 30% of the time make small human-like errors like typos, spacing issues, or capitalization mistakes. `;
      const combinedText = `${fixedText}${text}`;
      const prompt = encodeURIComponent(combinedText);

      const guru1 = `https://api.gurusensei.workers.dev/llama?prompt=${prompt}`;

      try {
        let response = await fetch(guru1);
        let data = await response.json();
        let result = data.response.response;
        let mediaUrl = data.response.mediaUrl; // Assuming the API provides a media URL

        if (!result) {
          throw new Error('No valid JSON response from the first API');
        }

        // Send text response
        await conn.sendMessage(m.chat, { text: result }, { quoted: m });

        // Send media if available
        if (mediaUrl) {
          await conn.sendMessage(m.chat, { image: { url: mediaUrl } }, { quoted: m }); // Change 'image' to 'video' or 'audio' if needed
        }

        m.react(done);
      } catch (error) {
        console.error('Error from the first API:', error);

        const guru2 = `https://ultimetron.guruapi.tech/gpt3?prompt=${prompt}`;

        let response = await fetch(guru2);
        let data = await response.json();
        let result = data.completion;
        let mediaUrl = data.mediaUrl; // Assuming the second API also provides a media URL

        // Send text response
        await conn.sendMessage(m.chat, { text: result }, { quoted: m });

        // Send media if available
        if (mediaUrl) {
          await conn.sendMessage(m.chat, { image: { url: mediaUrl } }, { quoted: m }); // Change 'image' to 'video' or 'audio' if needed
        }

        m.react(done);
      }
    } catch (error) {
      console.error('Error:', error);
      throw `*ERROR*`;
    }
  }
};

handler.help = ['R', 'riruru'];
handler.tags = ['AI'];
handler.command = ['bro', 'R', 'ai', 'gpt', 'riruru']; // Updated to include "R" instead of "chatgpt"

export default handler;