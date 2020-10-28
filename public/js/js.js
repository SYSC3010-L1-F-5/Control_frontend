barba.init({
    views: [
        {
            namespace: 'index',
            beforeEnter() {
                document.querySelector("[hss-nav='index']").classList.add("mdui-bottom-nav-active")
                runtime.user.functions.getUser()
            },
            afterLeave() {
                document.querySelector("[hss-nav='index']").classList.remove("mdui-bottom-nav-active")
            }
        },{
            namespace: 'devices',
            beforeEnter() {
                document.querySelector("[hss-nav='devices']").classList.add("mdui-bottom-nav-active")
                runtime.devices.functions.getDevices()
            },
            afterLeave() {
                document.querySelector("[hss-nav='devices']").classList.remove("mdui-bottom-nav-active")
            }
        },{
            namespace: 'events',
            beforeEnter() {
                document.querySelector("[hss-nav='events']").classList.add("mdui-bottom-nav-active")
            },
            afterLeave() {
                document.querySelector("[hss-nav='events']").classList.remove("mdui-bottom-nav-active")
            }
        },{
            namespace: 'users',
            beforeEnter() {
                document.querySelector("[hss-nav='users']").classList.add("mdui-bottom-nav-active")
                runtime.user.functions.getUsers()
            },
            afterLeave() {
                document.querySelector("[hss-nav='users']").classList.remove("mdui-bottom-nav-active")
            }
        },{
            namespace: 'login',
            beforeEnter() {
                document.getElementById("logout-button").classList.add("hss-display-none")
                document.getElementById("footer").classList.add("hss-display-none")
            },
            afterEnter() {
                runtime.server.init.loadServer()
                document.getElementById("server_addr").value = runtime.server.address + ":" + runtime.server.port
            },
            afterLeave() {
                document.getElementById("logout-button").classList.remove("hss-display-none")
                document.getElementById("footer").classList.remove("hss-display-none")
            }
        }
    ]
});
runtime.versions.barba = barba.version
runtime.server.init.loadServer()
  