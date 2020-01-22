// chrome.tabs.query({'active': true, 'currentWindow': true}, function (tabs) {
//     url = tabs[0].url;
//     console.log('url frm ext',url);
// });
// debugger;
let counter = 0;
let prevCounter = 1;
function setAllRead(val) {
    if(counter!=prevCounter){
        chrome.runtime.sendMessage({message: "updateBadge",text : val}, function(response) {
            prevCounter = counter;
            //console.log(response);
          });
    }
    
}
let hinduArr=[];
const urlFuncMap = [
    {
        siteName : 'economictimes.indiatimes.com',
        funcName : 'removeAddET'
    },{
        siteName : 'hindu.com',
        funcName : 'removeHinduPayWall' 
    },{
        siteName : 'medium.com',
        funcName : 'removeAdMedium'
    },{
        siteName : 'wired.com',
        funcName : 'removeWiredPayWall'
    },{
        siteName : 'quora.com',
        funcName : 'removeQuoraWall'
    },{
        siteName : 'thehindubusinessline.com',
        funcName : 'removeTheHinduBusiness'
    },{
        siteName : 'nytimes.com',
        funcName : 'removeNYPayWall'
    },{
        siteName : 'bloomberg.com',
        funcName : 'removePayWallUsingCookie'
    },{
        siteName : 'chicagotribune.com',
        funcName : 'removePayWallUsingCookie',
    },{
        siteName : 'chicagobusiness.com',
        funcName : 'removePayWallUsingCookie'
    },
    {
        siteName : 'washingtonpost.com',
        funcName : 'removePayWallUsingCookie'
    },{
        siteName : 'levelup.gitconnected.com',
        funcName : 'removeAdMedium'
    },
    
];
const adSiteListing = [
    {
        siteName : 'Google Ads',
        querySelector : ['div-gpt','masthead-ad','player-ads'],
        attrName : ['data-google-query-id'],
        className : ['ads-ad','adsbygoogle'],
        adScriptVal : ['doubleclick','adservice','googlesyndication'],
        tagSearch : [{
            tagName : 'a',
            tagImpactAttr : 'href',
            tagSearch : ['adservice']
        },{
            tagName : 'iframe',
            tagImpactAttr : 'src',
            tagSearch : ['adservice']
        },{
            tagName : 'img',
            tagImpactAttr : 'src',
            tagSearch : ['doubleclick']
        }],
        allow : false
    },
    {
        siteName : 'Taboola',
        querySelector : ['taboola'],
        attrName : ['tbl-data-mutation-observer','observeid'],
        adScriptVal : ['taboola'],
        allow : false
    },{
        siteName : 'DuckDuckGo',
        className : ['results--ads']
    },
    {
        siteName : 'Colombia',
        className : ['colombiaAd'],
        querySelector : ['div-clmb-ctn'],
        adScriptVal : ['colombia','clmbtech'],
        attrName:['data-adsslot'],
        allow : false
    },
    {
        siteName : 'Common',
        className : ['ad-cf','ad','promotedlink','logged_out_ad','promoted_content_ad','question_page_ad','ad-unit','js-stream-ad','teads-inread'],
        attrName : ['data-beacon','data-kiosked-cntrid'],
        tagSearch : [{
            tagName : 'a',
            tagImpactAttr : 'href',
            tagSearch : ['adservice']
        },{
            tagName : 'iframe',
            tagImpactAttr : 'src',
            tagSearch : ['trafficjunky']
        },{
            tagName : 'img',
            tagImpactAttr : 'src',
            tagSearch : ['trafficfactory','doubleclick']
        }],
        allow : false
    },
    {
        siteName : 'OutBrain',
        attrName : ['data-ob-mark'],
        allow : false
    },
    {
        siteName : 'GpLinks',
        adScriptVal : ['bannersnack','deloplen'],
        tagName : 'iframe',
        tagValList : ['bannersnack'],
        className : ['banner'],
        allow : false
    },{
        siteName : 'Dianomi',
        attrName : ['data-dianomi-context-id'],
        adScriptVal : ['dianomi'],
        allow : false

    },{
        siteName : 'mgid',
        className : ['mgline','mgbox'],
        adScriptVal : ['mgid'],
        allow : false
    },{
        siteName : 'Amazon Ads',
        querySelector : ['amzn-assoc-ad'],
        allow : false
    },{
        siteName : 'yahoo',
        tagSearch : [{
            tagName : 'iframe',
            tagImpactAttr : 'src',
            tagSearch : ['flashtalking','advertising','pictela','yimg']
        }],
        allow : false
    },{
        siteName : 'exosrv',
        adScriptVal : ['exosrv'],
        tagSearch : [{
            tagName : 'iframe',
            tagImpactAttr : 'src',
            tagSearch : ['exosrv']
        }],
        allow : false
    },{
        siteName : 'montwam',
        adScriptVal : ['montwam'],
        tagSearch : [{
            tagName : 'iframe',
            tagImpactAttr : 'src',
            tagSearch : ['montwam']
        }],
        allow : false
    }
]
isOperatable = (obj) => {
    if(typeof obj === 'object' && obj.length > 0){
        return true;
    }
    return false;
}
const getElementFromClass = (className) => {
    if(className){
        let elem = document.getElementsByClassName(className);
        if(elem && elem.length > 0){
            return elem;
        }else{
            return false;
        }
    }
}
const getElementFromId = (idName) => {
    if(idName){
        let elem = document.getElementById(idName);
        if(elem){
            return elem;
        }else{
            return false;
        }
    }
}

clearCookieDomain = (domain) => {
    if(typeof chrome.app.isInstalled!=='undefined'){
        chrome.runtime.sendMessage({clearCoookies: "yes",domain : domain}, function(response) {
            //console.log(response);
          });
     }
    
}

removeClassFromElement = (elem,className) => {
    return elem[0].classList.remove(className);
}

removeAddET = () => {
    document.body.style.overflow = 'visible';
    let checkPayWall = document.getElementsByClassName('afp');
    if(checkPayWall && checkPayWall.length > 0)
        document.getElementsByClassName('afp')[0].style.display = 'none'

    let scp = document.createElement('script');
    scp.innerHTML = "if(typeof objAd == 'object'){objAd.type = 'adfree';objAd.removeAd()}";
    document.body.append(scp);
}
const removeAdMedium = () => {
    
    let loginModal = getElementFromClass('n o p qh qi qj qk ql qm s t qn u v qo');
    if(loginModal){
        loginModal[0].style.display = 'none'
    }
    let signInFooterModal = getElementFromId('lo-meter-banner-background-color');
    if(signInFooterModal){
        signInFooterModal.parentElement.style.display = 'none'
    }
    localStorage.clear();
    sessionStorage.clear();
    clearCookieDomain('medium.com');
    clearCookieDomain('levelup.gitconnected.com');
    // console.clear();
    
    let has500error = getElementFromClass('wm wn r');
    if(isOperatable(has500error)){
        location.reload();
    }
    let expiredRead = getElementFromId('regwall-background-color');
    if(expiredRead){
        //console.log('user reached limit')
    }

}
removeHinduPayWall = () => {
    let overlayWall = getElementFromClass('overlay');
    if(overlayWall){
        removeClassFromElement(overlayWall,'overlayblock');
    }

    let payWall = getElementFromClass('addblockersection');
    if(payWall){
        removeClassFromElement(payWall,'enableaddblockersection');
    }
    localStorage.clear();
    document.body.style.overflow = 'visible';
}

removeWiredPayWall = () => {
    clearCookieDomain('wired.com');
    let signInModal = getElementFromClass('paywall-bar');
    if(signInModal){
        signInModal[0].style.display = 'none';
    }
}
removeQuoraWall = () => {
    let overlayWall = getElementFromClass('signup_wall_prevent_scroll');
    if(overlayWall){
        removeClassFromElement(overlayWall,'signup_wall_prevent_scroll');
        let signInModal = getElementFromClass('BaseSignupForm');
        if(signInModal){
            signInModal[0].style.display = 'none';
        }
    }
}
removeTheHinduBusiness = (callback) => {
    // let getElm = getElementFromClass('contentbody');
    
    let getElm = getElementFromClass('paywall');
    if(isOperatable(getElm)){
        storeVal = getElm[0].innerHTML;
        hinduArr.push(storeVal);
        let scp = document.createElement('script');
    scp.innerHTML = "isNonSubcribed = false";
    document.body.append(scp);
    document.body.prepend(scp);
        let signUpModal = getElementFromClass('subarticlepay');
        if(signUpModal){
            signUpModal[0].style.display = 'none';
           // getElm[0].innerHTML = hinduArr[0];
        }
        //console.log('hindu',getElm[0].children[0].innerHTML);
    }
    
}

removeNYPayWall = () =>{
    
    localStorage.clear();
    sessionStorage.clear();
    clearCookieDomain('nytimes.com')
    let adBlkWall = getElementFromClass('expanded-dock');
    if(isOperatable(adBlkWall)){
        displayNone(adBlkWall[0]);
    }
}
removePayWallUsingCookie = (item) => {
    localStorage.clear();
    sessionStorage.clear();
    clearCookieDomain(item.siteName);
}
removeBloomBergPayWall = () =>{
    
    localStorage.clear();
    sessionStorage.clear();
    clearCookieDomain('bloomberg.com')
}
removeChicagoPayWall= () =>{
    
    localStorage.clear();
    sessionStorage.clear();
    clearCookieDomain('chicagotribune.com')
}
//removeTheHinduBusiness((val)=>{console.log('callback',val)});
displayNone = (elem) =>{
    if(elem){
        elem.setAttribute("style",'display :none !important')
    }
}

removeScriptBySearchName = (name,tagName) => {
    if(Array.isArray(name)){
        name.forEach((arr) => {
            let scriptList = [...document.getElementsByTagName(tagName)];
            if(isOperatable(scriptList)){
                let scriptListByName = scriptList.filter((item)=>{
                    if(item.src && item.src.includes(arr)){return item}
                });
                if(isOperatable(scriptListByName)){
                    scriptListByName.map((item)=>{
                        if(item && item.src){
                            item.src = '';
                        }
                    })
                }
            }
        })
    }
    
}
disableAds = () => {
    adSiteListing.forEach((item) => {
        if(!item.allow){
            if(item.querySelector){
                disableAdsUsingQuery(item);
            }
            if(item.attrName){
                disableAdsUsingAttr(item);
            }
            if(item.className){
                disableAdsUsingClass(item);
            }
            if(item.adScriptVal){
                removeScriptBySearchName(item.adScriptVal,'script');
            }
            if(item.tagSearch){
                item.tagSearch.forEach((tag)=>{
                    disableElementByTags(tag);
                })
            }
            if(item.tagName){
                item.tagValList.forEach((tag)=>{
                    removeScriptBySearchName(tag,item.tagName);
                })
                
            }
        }
        
    })
}
disableElementByTags = (tag) => {
    const {tagName,tagImpactAttr,tagSearch} = tag;
    const getElems = [...document.getElementsByTagName(tagName)];
    if(isOperatable(getElems)){
        getElems.forEach((item)=>{
            let getLink = item.getAttribute(tagImpactAttr);
            if(getLink){
                tagSearch.forEach((tgS)=>{
                    if(getLink.includes(tgS)){
                        item[tagImpactAttr] = '';
                        item.setAttribute("style",'display :none !important')
                    }
                })

                
            }
        })
    }
}
disableAdsUsingAttr = (val) =>{
    if(Array.isArray(val.attrName)){
        val.attrName.forEach((arr) => {
            let adsByAttr  = [...document.querySelectorAll('['+arr+']')];
            if(isOperatable(adsByAttr)){
                adsByAttr.map((item)=>{
                    if(item.style.display != 'none'){
                        counter = counter + 1;
                        //item.style.display = 'none';
                        item.setAttribute("style",'display :none !important')
                    }
                    
                })
            }
        })
    }
    
    setAllRead(counter);
    //removeScriptBySearchName(val.adScriptVal)
}
disableAdsUsingQuery = (val) =>{
    if(Array.isArray(val.querySelector)){
        val.querySelector.forEach((arr) => {
            let adsByQuery  = [...document.querySelectorAll('*[id^="'+arr+'"]')];
            if(isOperatable(adsByQuery)){
                adsByQuery.map((item)=>{
                    if(item.style.display != 'none'){
                        counter = counter + 1;
                        //item.style.display = 'none';
                        item.setAttribute("style",'display :none !important')
                    }
                })
            }
        })
        setAllRead(counter);
    }
    
    //removeScriptBySearchName(val.adScriptVal)
}
disableAdsUsingClass = (val) => {
    if(Array.isArray(val.className)){
        val.className.forEach((arr) => {
            let adsByClass = [...document.getElementsByClassName(arr)];
            if(isOperatable(adsByClass)){
                adsByClass.map((item)=>{
                    if(item.style.display != 'none'){
                        counter = counter + 1;
                        //item.style.display = 'none';
                        item.setAttribute("style",'display :none !important')
                    }
                })
            }
        })
        setAllRead(counter);
    } 
}

afterDOMLoaded = () => {
    //Everything that needs to happen after the DOM has initially loaded.
    const url = document.location.href;
    urlFuncMap.forEach((item)=>{
        if(url.includes(item.siteName)){
            eval(item.funcName)(item)
        }
    })
    //disableAds();
}
needsToBeBlacklisted = (src,type) => {
    let value = false;
    adSiteListing.forEach((item) => {
        if(item.adScriptVal){
            item.adScriptVal.forEach((scp) => {
                if(src.includes(scp)){
                    val = true;
                }
                //return false;
            })
        }
    });
    return value;
}

disableScriptOnLoad = () => {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                // For each added script tag
                if(node.nodeType === 1 && (node.tagName === 'SCRIPT' || node.tagName === 'LINK')) {
                    const src = node.src || ''
                    const type = node.type;
                    const href = node.href;
                    // If the src is inside your blacklist
                    adSiteListing.forEach((item) => {
                        if(item.adScriptVal){
                            item.adScriptVal.forEach((scp) => {
                                if(node.tagName === 'SCRIPT'){
                                    if(scp){
                                        if(src.includes(scp)){
                                            try{
                                                node.type = 'javascript/blocked'
                                                node.parentElement.removeChild(node)
                                            }catch(e){
                                                //console.log('exception',e);
                                                node.type = 'javascript/blocked'
                                            }
                                        }
                                    }
                                }else if(node.tagName === 'LINK'){
                                    if(scp){
                                        if(href.includes(scp)){
                                            try{
                                                node.href = '';
                                            }catch(e){
                                                //console.log('exception',e);
                                                node.href = ''
                                            }
                                        }
                                    }
                                }
                                
                                
                                //return false;
                            })
                        }
                    });
                }
            })
        })
    })
    
    // Starts the monitoring
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    })
}
window.onscroll = () => {
    disableAds();
    afterDOMLoaded();
}
const interval = setInterval(()=>{
    if(document.readyState == 'complete'){
        clearInterval(interval);
        afterDOMLoaded();
    }
    if(document.readyState == 'interactive'){
        document.addEventListener('DOMContentLoaded', (event) => {
            //console.log('DOM fully loaded and parsed');
        });
        disableAds();
    }
},3000);

runAdsConsistently = (time) => {
    setTimeout(()=>{
        disableAds();
        runAdsConsistently(time*2);
        disableScriptOnLoad();
        //console.log('runAdsConsistently func call',time);
    },time*100);
}

time = 1;
runAdsConsistently(1);
disableAds();
disableScriptOnLoad();
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      // listen for messages sent from background.js
      if (request.message === 'url-changed') {
            //console.log('url-change-content')
            afterDOMLoaded();
            disableAds();
            disableScriptOnLoad();
            time = 1;
      }
      return true;
  });