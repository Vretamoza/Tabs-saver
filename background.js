function removeProperty(keyToRemove, obj) {
  return Object.keys(obj).reduce((newObj, key) => {
    if (key !== keyToRemove) {
      newObj[key] = obj[key];
    }
    return newObj;
  }, {});
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "deleteTabs") {
    chrome.storage.local.get("tabGroups", ({tabGroups}) => {
      if (tabGroups) {
        const newTabs = removeProperty(message.name, tabGroups)
        chrome.storage.local.set({tabGroups: newTabs})
        sendResponse({success: true})
      }
    })
    return true
  }
  if (message.action === "loadData") {
    chrome.storage.local.get("tabGroups", (data) => {
      if (!data.tabGroups) {
        sendResponse({success: false})
        chrome.storage.local.set({tabGroups: {}})
      } else {
        sendResponse({success: true, data: data.tabGroups})
      }
      
    });
    return true;
  }
  if (message.action === "saveTabs") {
    chrome.windows.getCurrent({ populate: true }, (window) => {
        let tabsToSave = [];
        
        window.tabs.forEach((tab) => {
            const url = new URL(tab.url);
            const tabObject = {
                title: tab.title, 
                url: url.toString(), 
                id: tab.id, 
            };
            tabsToSave.push(tabObject);
        });

        chrome.storage.local.get("tabGroups", (data) => {
            if (data.tabGroups) {
                chrome.storage.local.set(
                    {
                        tabGroups: { ...data.tabGroups, [message.nameInput]: tabsToSave },
                    },
                    () => {
                        console.log("Saved Tabs: ", tabsToSave);
                    }
                );
            } else {
                chrome.storage.local.set({ tabGroups: { [message.nameInput]: tabsToSave } });
            }
            sendResponse({ success: true });
        });
    });
    return true; // Indica que la respuesta se enviará de forma asincrónica
} else if (message.action === "restoreTabs") {
    chrome.storage.local.get("tabGroups", ({tabGroups}) => {
      if (tabGroups) {
        console.log({tabGroups, name: message.name, test: tabGroups[message.name]})
        tabGroups[message.name].forEach((tab) => {
          chrome.tabs.create({ url: tab.url });
        });
        sendResponse({ success: true });
      } else {
        sendResponse({ success: false });
      }
    });
    return true; // Indicates that the response will be sent asynchronously
  }
});
