// Go to [[roam/js]], create a block {{roam/js}}, and then indent the below code underneath in a javascript block.

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
