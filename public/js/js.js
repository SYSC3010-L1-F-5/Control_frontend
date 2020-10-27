barba.init({
    views: [
        {
            namespace: 'login',
            beforeEnter() {
                document.getElementById("logout-button").classList.add("hss-display-none")
                document.getElementById("drawer-button").classList.add("hss-display-none")
                document.getElementById("drawer").classList.add("hss-drawer-hidden")
            },
            afterEnter() {
                runtime.server.init.loadServer()
                document.getElementById("server_addr").value = runtime.server.address + ":" + runtime.server.port
            },
            afterLeave() {
                document.getElementById("logout-button").classList.remove("hss-display-none")
                document.getElementById("drawer-button").classList.remove("hss-display-none")
                document.getElementById("drawer").classList.remove("hss-drawer-hidden")
            }
        }
    ]
});
runtime.versions.barba = barba.version
runtime.server.init.loadServer()
runtime.user.init.checkRememberMe()
  