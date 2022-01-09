# Project/Roam Whatsapp Bot
Page Status: Public  

Author: [@aay17ush](https://twitter.com/Aay17ush)  

Credits:  
  - [@jajoosam](https://sam.jajoo.fun/) for [Tutorial to connect Twilio to Server](https://dev.to/jajoosam/build-a-whatsapp-bot-fast--2hdc)  
  - [@bieber](https://twitter.com/Bieber) for [template JS functions to insert blocks in roam](https://davidbieber.com/snippets/2021-02-12-javascript-functions-for-inserting-blocks-in-roam/)  

**Quick Links**  
  - Twilio: https://www.twilio.com/  
  - Replit Repository: https://replit.com/@AayushKucheria/Roam-Whatsapp-Bot?v=1  

Tech:   
  - Server + DB: Javascript on replit  
  - Whatsapp: Twilio  

**Roam Team**: Check out How to improve upon the current setup  

---  

Hi there! 😄👋  

This is a bot that allows you to **add quick notes to your Daily Notes page from Whatsapp**. 

The current setup takes 12-15 minutes. But once it's done, you won't have to worry about it again until you finish your quota of 3000 quick notes (maybe a year?) 😉.  
  - Plus, it's a quick hack for now. Once I have a little help, I can automate most of it.  

---  

**Steps:**  
  - 🤖 Bot setup (5-7 minutes)  
    - Head over to [Twilio](https://www.twilio.com/try-twilio) and start your free trial. It's a big trial ($15usd = 3000 notes), so no need to worry 🤩.  
    - Verify your email and whatsapp phone number.  
    - After your verification is complete, you'll encounter the welcome screen which asks you to select your product. Choose the following options:  
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Faayush%2FTkpSbxwmIJ.png?alt=media&token=55283fb0-d61a-4ff5-9016-b6d85dde80ab)  
    - You'll be presented with a dialog to activate Twilio sandbox: go ahead and complete it.  
      - Basically, add the number `+14155238886` to your contacts list, and send the displayed code something vaguely similar to hello drive-muscle to that number from whatsapp.  
    - Skip the tutorial steps by clicking on `Next` in the bottom left corner until you arrive at **Twilio Sandbox for Whatsapp**. Now this is important.  
    - Keep this tab open and head on to [Twilio Console](https://www.twilio.com/console) to get your authentication keys.  
    - Save your `Account SID` and `Auth token`. We'll need these in a bit.  
    - Let's head over to create our very own server and come back to this in 3 minutes. It's quite easy, so no worries! 😉💪  
  - 👨🏼‍💻 Backend setup (5-7mins)  
    - Create a [Replit](https://repl.it/) account if you don't have one.  
    - Now, Head over to [this replit backend](https://replit.com/@AayushKucheria/Roam-Whatsapp-Bot?v=1) and fork it.  
    - You'll now see a screen with my code.  
    - Click on the add file icon and create a file named `.env` (just that, a dot followed by env).  
      - The first icon in the top bar here:<br/>![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Faayush%2FgB24pDrOdd.png?alt=media&token=08d5a973-89f5-4868-8944-48d7e4f059cf)  
    - Copy the text indented right here, replacing the values with the ones you saved from Twilio here: Save your `Account SID` and `Auth token`. We'll need these in a bit.   
      - SID=AC5oihadgf9kdfjas<br/>KEY=ffaou4tkngfafrhjoi  
        - The Auth token is the key.  
    - Run your repl! If all is allright, you should see a website pop up and a message in the terminal saying `Your app is listening on port x`.  
    - As long as you don't manually click the stop button, you don't need to worry about this now. It'll work even when you close your tab. This is your server - ready to serve!  
    - Now, let's connect this server to Twilio: once and for all.   
    - Click on the grayed out buttom beside your project name, and open spotlight page from there.  
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Faayush%2FWucke6heHZ.png?alt=media&token=ae0ecec3-75a1-4351-88c4-35e7857c3db9)  
    - On this page, right click on the grayed out button on the right and `copy link address`.  
      - ![](https://firebasestorage.googleapis.com/v0/b/firescript-577a2.appspot.com/o/imgs%2Fapp%2Faayush%2F41SajIwjZb.png?alt=media&token=56fa66a0-387f-439e-8412-8c0a7f0a4d13)  
    - Your replit is all set. Now, we just need to add this copied address to our twilio, and we'll be ready to call everything together in roam/js.  
  - 🧠 Final Setup (2-3mins)  
    - Go back to your [Twilio Whatsapp Sandbox](https://www.twilio.com/console/sms/whatsapp/sandbox) and you'll see the heading **Sandbox Configuration**:  
      - In both the fields, paste your url with `/incoming` in front of it.  
        - For example (with **my** url)  
        - `When a message comes in`: https://roam-whatsapp-bot.abd3.repl.co/incoming  
        - `Status callback url`: https://roam-whatsapp-bot.abd3.repl.co/incoming  
    - Save your changes here (scroll down if you don't see the button).  
    - Finally, head to your roam graph and open the page roam/js.  
      - Copy the indented blocks below exactly to your roam/js - Red + Code block underneath it.   
        - {{roam/js}}  

```javascript

window.whatsappParams = {
  blockTitle: "Whatsapp Quick Notes",
  // 0=Top, -1=Bottom of Page
  order: 0,
  noteOrder: 0, // Append new notes {random for now} 
  replitUrl: "paste url/roam here" // TODO
}

const whatsappParams = window.whatsappParams;

// Get the "th" of 3rd, "nd" of 2nd, and so on (for daily notes page).
function ordinal_suffix_of(i) {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
};

// Return today's date in "Daily Notes" format.
function getDailyNotePage() {
  var date = new Date();

  var formatter = new Intl.DateTimeFormat('en-us', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  var today = formatter.formatToParts(date).map(({type, value}) => {
    switch(type) {
      case 'day': return ordinal_suffix_of(value);
      default: return value;
    }
  }).join('');
  
  return today;
};

// The following functions interacting with roam blocks have been sourced from @DavidBieber
// Link: https://davidbieber.com/snippets/2021-02-12-javascript-functions-for-inserting-blocks-in-roam/
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get daily notes page
function getPage(page) {
  // returns the uid of a specific page in your graph.
  // _page_: the title of the page.
  let results = window.roamAlphaAPI.q(`
    [:find ?uid
     :in $ ?title
     :where
     [?page :node/title ?title]
     [?page :block/uid ?uid]
    ]`, page);
  if (results.length) {
    return results[0][0];
  }
}

/*
* Get child blocks nested under the Whatsapp quick notes tag
*/
function getChildBlock(parent_uid, block) {
  // returns the uid of a specific child block underneath a specific parent block.
  // _parent_uid_: the uid of the parent block.
  // _block_: the text of the child block.
  let results = window.roamAlphaAPI.q(`
    [:find ?block_uid
     :in $ ?parent_uid ?block_string
     :where
     [?parent :block/uid ?parent_uid]
     [?block :block/parents ?parent]
     [?block :block/string ?block_string]
     [?block :block/uid ?block_uid]
    ]`, parent_uid, block);
  if (results.length) {
    return results[0][0];
  }
}

async function createChildBlock(parent_uid, block, order) {
  // returns the uid of a specific child block underneath a specific parent block, creating it first if it's not already there.
  // _parent_uid_: the uid of the parent block.
  // _block_: the text of the child block.
  // _order_: (optional) controls where to create the block, 0 for inserting at the top, -1 for inserting at the bottom.
  if (!order) {
    order = 0;
  }
  window.roamAlphaAPI.createBlock(
    {
      "location": {"parent-uid": parent_uid, "order": order},
      "block": {"string": block}
    }
  );
  let block_uid;
  while (!block_uid) {
    await sleep(25);
    block_uid = getChildBlock(parent_uid, block);
  }
  return block_uid;
}

/*
* Get a block on the Daily Notes page
*/
function getBlockOnPage(page, block) {
  // returns the uid of a specific block on a specific page.
  // _page_: the title of the page.
  // _block_: the text of the block.
  let results = window.roamAlphaAPI.q(`
    [:find ?block_uid
     :in $ ?page_title ?block_string
     :where
     [?page :node/title ?page_title]
     [?page :block/uid ?page_uid]
     [?block :block/parents ?page]
     [?block :block/string ?block_string]
     [?block :block/uid ?block_uid]
    ]`, page, block);
  if (results.length) {
    return results[0][0];
  }
}

async function createBlockOnPage(page, block, order) {
  // creates a new top-level block on a specific page, returning the new block's uid.
  // _page_: the title of the page.
  // _block_: the text of the block.
  // _order_: (optional) controls where to create the block, 0 for top of page, -1 for bottom of page.
  let page_uid = getPage(page);
  return createChildBlock(page_uid, block, order);
}

async function getOrCreateBlockOnPage(page, block, order) {
  // returns the uid of a specific block on a specific page, creating it first as a top-level block if it's not already there.
  // _page_: the title of the page.
  // _block_: the text of the block.
  // _order_: (optional) controls where to create the block, 0 for top of page, -1 for bottom of page.
  let block_uid = getBlockOnPage(page, block);
  if (block_uid) return block_uid;
  return createBlockOnPage(page, block, order);
}

// Connect with replit server
const Http = new XMLHttpRequest();
Http.open("POST", whatsappParams.replitUrl);
Http.send();

// 
//Http.onreadystatechange=(e)=> {
Http.onload = async function() {
  const response = JSON.parse(Http.responseText);

  var block = await getOrCreateBlockOnPage(getDailyNotePage(), whatsappParams.blockTitle, whatsappParams.order)
  for (messageId in response) {
    await createChildBlock(block, response[messageId], whatsappParams.noteOrder);
  }
}
```  
      - On line 7 of the code block, paste your replit url with `/roam` apppended to it, like   
        - `replitUrl = "https://roam-whatsapp-bot.aayushkucheria.repl.co/roam";`   
    - Run the red block - `Yes I know what I'm doing`.  
  - **And you're done!** Now whenever you send any messages to the bot, it'll store those messages on our replit server. Then when you open Roam, it'll add those messages to your daily notes and delete them from the server.  

---  

## How to improve upon the current setup  
  - Removing Bot Setup for Users  
    - With a _roam_ twilio account for each user, (or direct access to the private whatsapp api) - we can remove the most cumbersome part of this process.  
    - Users can simply authenticate themselves through the chat, and start taking notes directly.  
  - Removing Server and roam/js setup for Users  
    - With a central server, we wouldn't need each user to have their own server. I went with individual servers right now because I don't have money to host a server for so many people :P  
    - With access to the roam-api, we can listen for callback events and directly call the roam graph to insert blocks - no roam/js needed?.  
      - Replit doesn't allow stuff like puppeteer, but I still kept it for now coz of it's ease to fork and run.  
  - Block-refs and Attachments: Need to test  
  - Why I'm not using powerful unofficial whatsapp apis:  
    - Example: https://github.com/orkestral/venom  
    - Once you connect them to your account, they can go through (and modify) everything that exists or will exist in your whatsapp chats. I don't think that's smart.  
    - They use pupeeter to launch whatsapp web, and since whatsapp only allows one instance to run at a time - users can't use whatsapp web for themselves if they want to.  