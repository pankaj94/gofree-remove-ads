// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const use_google_bot = [
  'barrons.com',
  'lemonde.fr',
  'nytimes.com',
  'quora.com',
  'telegraph.co.uk',
  'theaustralian.com.au',
  'themercury.com.au',
  'thetimes.co.uk',
  'wsj.com',
  'haaretz.co.il',
  'haaretz.com',
  'themarker.com',
  'nknews.org',
  'prime.economictimes.indiatimes.com/news',
  'business-standard.com',

];

const adScriptValues = ['doubleclick','adservice','googlesyndication','taboola','colombia','clmbtech','bannersnack','deloplen','dianomi','mgid','exosrv','montwam',
'adsafeprotected','amp4ads','googleads','adsystem','pubmatic','media.net','moatads','manageads','imdbads']

const userAgentDesktop = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"
const userAgentMobile = "Chrome/41.0.2272.96 Mobile Safari/537.36 (compatible ; Googlebot/2.1 ; +http://www.google.com/bot.html)"
var useUserAgentMobile = false;
var setReferer = false;




// chrome.runtime.onInstalled.addListener(function() {
//   chrome.storage.sync.set({color: '#3aa757'}, function() {
//     console.log('The color is green.');
//   });
//   chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
//     chrome.declarativeContent.onPageChanged.addRules([{
//       conditions: [new chrome.declarativeContent.PageStateMatcher({
//         pageUrl: {hostEquals: 'developer.chrome.com'},
//       })],
//       actions: [new chrome.declarativeContent.ShowPageAction()]
//     }]);
//   });
// });

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    // read changeInfo data
    if (changeInfo.url) {
      // url has changed; do something here
      // like send message to content script
      chrome.tabs.sendMessage( tabId, {
        message: 'url-changed',
        url: changeInfo.url
      })
    }
  }
);
chrome.webRequest.onBeforeRequest.addListener(function(details) {
 
  // let value = adScriptValues.forEach((item)=>{
  //   let val;
  //   if (details.url.indexOf(item) >  0) {
  //     console.log('match found');
  //     val = {cancel: true};
  //     return val;
  //   }else{
  //     console.log('else called');
  //     val = true;
  //     return val;
  //   }
  //   return val;
  // })
  // return value;
  var val = true;
  // while (i < adScriptValues.length) {
  //   if(details.url.includes(adScriptValues[i])){
  //     val = {cancel: true};
  //   }

  // }


  for(let i = 0;i<adScriptValues.length;i++){
    if(details.url.includes(adScriptValues[i])){
      val = {cancel: true};
    }

   if(i == adScriptValues.length-1){
        return val;
    }
  }
  return val;
// adScriptValues.find((item)=>{
//   if(details.url.includes(item)){
//         return {cancel: true};
//   }
// })

// let i = 0;
// do {
//   return {cancel: true};
// }
// while (details.url.includes(adScriptValues[i]));

  
  
  },
  {
    urls: ["<all_urls>"],
    types: ["script","xmlhttprequest"]
  },
  ["blocking"]
);


// chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
//   var requestHeaders = details.requestHeaders;

//   var header_referer = '';
//   for (var n in requestHeaders) {
// 	  if (requestHeaders[n].name.toLowerCase() == 'referer') {
// 		  header_referer = requestHeaders[n].value;
// 		  continue;
// 	  }
//   }
  
//   // check for blocked regular expression: domain enabled, match regex, block on an internal or external regex
//   // for (var domain in blockedRegexes) {
// 	//   if (isSiteEnabled({url: '.'+ domain}) && details.url.match(blockedRegexes[domain])) {
// 	// 		if (details.url.indexOf(domain) !== -1 || header_referer.indexOf(domain) !== -1) {
// 	// 			return { cancel: true };
// 	// 		}
// 	//   }
//   // }

//   // if (!isSiteEnabled(details)) {
//   //   return;
//   // }

//   var tabId = details.tabId;
  
//   var useUserAgentMobile = false;
//   var setReferer = false;

//   // if referer exists, set it to google
//   requestHeaders = requestHeaders.map(function(requestHeader) {
//     if (requestHeader.name === 'Referer') {
//       if (details.url.indexOf("cooking.nytimes.com/api/v1/users/bootstrap") !== -1) {
//         // this fixes images not being loaded on cooking.nytimes.com main page
//         // referrer has to be *nytimes.com otherwise returns 403
//         requestHeader.value = 'https://cooking.nytimes.com';
//       } else if (details.url.indexOf("wsj.com") !== -1 || details.url.indexOf("ft.com") !== -1) {
//         requestHeader.value = 'https://www.facebook.com/';
//       } else {
//         requestHeader.value = 'https://www.google.com/';
//       }
//       setReferer = true;
//     }
//     if (requestHeader.name === 'User-Agent') {
//       useUserAgentMobile = requestHeader.value.toLowerCase().includes("mobile");
//     }

//     return requestHeader;
//   });

//   // otherwise add it
//   if (!setReferer) {
//     if (details.url.indexOf("wsj.com") !== -1) {
//       requestHeaders.push({
//         name: 'Referer',
//         value: 'https://www.facebook.com/'
//       });
//     } else {
//       requestHeaders.push({
//         name: 'Referer',
//         value: 'https://www.google.com/'
//       });
//     }
//   }

//   // override User-Agent to use Googlebot
//   var useGoogleBot = use_google_bot.filter(function(item) {
//     return typeof item == 'string' && details.url.indexOf(item) > -1;
//   }).length > 0;

//   if (useGoogleBot) {
//     requestHeaders.push({
//       "name": "User-Agent",
//       "value": useUserAgentMobile ? userAgentMobile : userAgentDesktop
//     })
//     requestHeaders.push({
//       "name": "X-Forwarded-For",
//       "value": "66.249.66.1"
//     })
//   }

//   // remove cookies before page load
//   // requestHeaders = requestHeaders.map(function(requestHeader) {
//   //   for (var siteIndex in allow_cookies) {
//   //     if (details.url.indexOf(allow_cookies[siteIndex]) !== -1) {
//   //       return requestHeader;
//   //     }
//   //   }
//   //   if (requestHeader.name === 'Cookie') {
//   //     requestHeader.value = '';
//   //   }
//   //   return requestHeader;
//   // });

//   // if (tabId !== -1) {
//   //   // run contentScript inside tab
//   //   browser.tabs.executeScript(tabId, {
//   //     file: 'contentScript.js',
//   //     runAt: 'document_start'
//   //   }, function(res) {
//   //     if (browser.runtime.lastError || res[0]) {
//   //       return;
//   //     }
//   //   });
//   // }

//   return { requestHeaders: requestHeaders };
// }, {
//   urls: ['<all_urls>']
// }, ['blocking', 'requestHeaders']);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.clearCoookies == "yes"){
      chrome.cookies.getAll({domain: request.domain}, function(cookies) {
        if(cookies && cookies.length > 0){
          for(var i=0; i<cookies.length;i++) {
            chrome.cookies.remove({url: "https://" + request.domain  + cookies[i].path, name: cookies[i].name});
          }
          sendResponse('done');
        }
        
    });
    //chrome.cookies.remove({"url": "http://medium.com", "name": "_parsely_visitor"}, function(deleted_cookie) { console.log(deleted_cookie); });
      
    }
    if(request.message == 'updateBadge'){
      chrome.browserAction.setBadgeBackgroundColor({color: 'red'});
      chrome.browserAction.setBadgeText({text: ''+request.text});  
      sendResponse('done');
    }
      
  });
