// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });
// debugger;
// chrome.tabs.getCurrent(tab => {
//   chrome.pageAction.show(tab.id);
// });

//example of using a message handler from the inject scripts
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//   	chrome.pageAction.show(sender.tab.id);
//     sendResponse();
//   });
// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Update the declarative rules on install or upgrade.
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // When a page contains a <video> tag...
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              urlMatches: `\-([0-9]*).html`
            }
          })
        ],
        // ... show the page action.
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
});
