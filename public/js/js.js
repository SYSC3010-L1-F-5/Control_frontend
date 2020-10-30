barba.init({
    views: [
        {
            namespace: 'index',
            beforeEnter() {
                document.querySelector("[hss-nav='index']").classList.add("mdui-bottom-nav-active")
                runtime.user.functions.getUser()
                document.getElementById("hss-loading-bar").classList.add("hss-hidden")
            },
            afterLeave() {
                document.querySelector("[hss-nav='index']").classList.remove("mdui-bottom-nav-active")
                document.getElementById("hss-loading-bar").classList.remove("hss-hidden")
            }
        },{
            namespace: 'devices',
            beforeEnter() {
                document.querySelector("[hss-nav='devices']").classList.add("mdui-bottom-nav-active")
                runtime.user.functions.getUser()
                runtime.devices.functions.getDevices()
                document.getElementById("hss-loading-bar").classList.add("hss-hidden")
            },
            afterLeave() {
                document.querySelector("[hss-nav='devices']").classList.remove("mdui-bottom-nav-active")
                document.getElementById("hss-loading-bar").classList.remove("hss-hidden")
            }
        },{
            namespace: 'events',
            beforeEnter() {
                document.querySelector("[hss-nav='events']").classList.add("mdui-bottom-nav-active")
                runtime.user.functions.getUser()
                runtime.events.functions.getEvents()
                document.getElementById("hss-loading-bar").classList.add("hss-hidden")
            },
            afterLeave() {
                document.querySelector("[hss-nav='events']").classList.remove("mdui-bottom-nav-active")
                document.getElementById("hss-loading-bar").classList.remove("hss-hidden")
            }
        },{
            namespace: 'users',
            beforeEnter() {
                document.querySelector("[hss-nav='users']").classList.add("mdui-bottom-nav-active")
                runtime.user.functions.getUser()
                runtime.user.functions.getUsers()
                document.getElementById("hss-loading-bar").classList.add("hss-hidden")
            },
            afterLeave() {
                document.querySelector("[hss-nav='users']").classList.remove("mdui-bottom-nav-active")
                document.getElementById("hss-loading-bar").classList.remove("hss-hidden")
            }
        },{
            namespace: 'login',
            beforeEnter() {
                document.getElementById("logout-button").classList.add("hss-display-none")
                document.getElementById("footer").classList.add("hss-display-none")
                document.getElementById("hss-loading-bar").classList.add("hss-hidden")
            },
            afterEnter() {
                runtime.server.init.loadServer()
                document.getElementById("server_addr").value = runtime.server.address + ":" + runtime.server.port
            },
            afterLeave() {
                document.getElementById("logout-button").classList.remove("hss-display-none")
                document.getElementById("footer").classList.remove("hss-display-none")
                document.getElementById("hss-loading-bar").classList.remove("hss-hidden")
            }
        }
    ],
    requestError: (trigger, action, url, response) => {
        // go to a custom 404 page if the user click on a link that return a 404 response status
        if (action === 'click' && response.status && response.status === 404) {
          runtime.misc.functions.errorDialog("404", "Page Not Found")
        }
    
        // prevent Barba from redirecting the user to the requested URL
        // this is equivalent to e.preventDefault() in this context
        return false;
    },
    timeout: 5000
});
runtime.versions.barba = barba.version
runtime.server.init.loadServer()
  