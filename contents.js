function inject(func) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.appendChild(document.createTextNode("(" + func + ")();"));
  document.addEventListener("DOMContentLoaded", function(event) { 
    document.body.appendChild(script);
  });
}
function videosController() {
    this.name = "video controller"
    var program = {
        name :"control videos",
        insertCss(){
              if(this.stylesActive) return;
                  this.stylesActive = true;  

              const styleCsss = `
                  .ad-container,
                  .ad-div,
                  .masthead-ad-control,
                  .video-ads,
                  .ytp-ad-progress-list,
                  #ad_creative_3,
                  #footer-ads,
                  #masthead-ad,
                  #player-ads,
                  .ytd-mealbar-promo-renderer,
                  #watch-channel-brand-div,
                  #watch7-sidebar-ads,
                  .html5-video-player.ad-showing video {
                    display: none !important;
                    max-height: 1px; max-width: 1px;
              }
              .ytp-ad-overlay-slot { bottom: -9999999999999999999px; }
              .ytp-ad-overlay-open .caption-window.ytp-caption-window-bottom { margin-bottom: 1px;}
              #alerts{ text-align: center;font-size: 1.4em;color: white;}
              `;
              const style = document.createElement("style");
              style.appendChild(document.createTextNode(styleCsss));
              this.fn$headReady(() => document.head.appendChild(style));
        },
        videosController(){
                this.fn$onSkipBtnMounted(".ytp-ad-skip-button.ytp-button", (btn) => {
                    console.log("btn sk");
                    btn.click();
                });
                //video without Skip button
                this.fn$onSkipBtnMounted(".html5-video-player.ad-showing video",(video) =>{
                    console.log("video sk");
                    video.currentTime = 10000;            
                })           
        },
        windowKeyEvent(){
                    document.onkeydown = function(evt){
                      evt = evt || window.event;
                      var video = document.getElementsByTagName('video')[0];
                      if(evt.shiftKey){
                                switch (evt.keyCode){
                                  case 90:  // shift + Z
                                          video.playbackRate = 1;
                                          document.getElementById('alerts').innerHTML = video.playbackRate;
                                      break;
                                  case 88:  // shif + X  
                                      video.playbackRate = video.playbackRate - 0.025;
                                      document.getElementById('alerts').innerHTML = video.playbackRate;
                                      break;
                                  case 83:  //shif + S
                                      video.playbackRate = video.playbackRate + 0.025;
                                      document.getElementById('alerts').innerHTML = video.playbackRate;
                                      break;           
                              }
                              return;
                      }
                      switch (evt.keyCode){
                            case 32:  // show caption on that
                                  document.getElementById('alerts').innerHTML = document.getElementsByClassName("caption-window")[0].innerText;
                                  break;
                            case 90:  // Z
                                    video.currentTime = video.currentTime - 1.5;
                                    break;
                            case 88:  //X  
                                    video.currentTime = video.currentTime +2;
                                    break;         
                      }
                  };
        },
        fn$headReady(callback) {
                if (document.readyState === "complete") {
                  callback();
                  return;
                }
                const observer = new MutationObserver(function (mutations) {
                  mutations.forEach(function (m) {
                    if (
                      m.addedNodes &&
                      m.addedNodes[0] &&
                      m.addedNodes[0].nodeName === "BODY"
                    ) {
                      callback();
                      observer.disconnect();
                    }
                  });
                });
                observer.observe(document.documentElement, { childList: true });
        },
        fn$onSkipBtnMounted(selector, callback) {
                function check(mutation) {
                  const $found = document.querySelector(selector);
                  if ($found) {
                    return callback($found);
                  }
                }
                check();
              
                const player = document.getElementsByTagName("ytd-player")[0];
                if (!player) {
                  return setTimeout(() => {
                    this.fn$onSkipBtnMounted(selector, callback);
                  }, 300);
                }
              
                console.log(this.name,"mount observer");
                const observer = new MutationObserver(check);
                observer.observe(player, {
                  childList: true,
                  subtree: true,
                });
      }
          
    };
    program.insertCss();
    program.videosController();
    program.windowKeyEvent();
}

if (location.host.includes(".youtube.com")){
        if(!window.AaaVideoControllerMannager) 
                  AaaVideoControllerMannager = new videosController();
}
