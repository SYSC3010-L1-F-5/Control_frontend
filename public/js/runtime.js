function toLogin() {
    if (window.location.pathname !== "/login") {
        clearLS()
        barba.go("/login")
    }
}

function getServerAddrFromLS() {
    var server = localStorage.getItem("server")
    if (server === null) {
        toLogin()
        return
    }
    const serverJson = JSON.parse(server)
    const serverAddr = `http://${serverJson.address}:${serverJson.port}`
    return serverAddr
}

function loadServer() {
    var server = localStorage.getItem("server")
    if (server === null) {
        setDefault()
        localStorage.setItem("server", JSON.stringify(runtime.server))
        return false
    } else {
        try {
            serverJson = JSON.parse(server)
        } catch {
            setDefault()
            return false
        }
        loadLS()
        return true
    }
    function setDefault() {
        runtime.server.address = window.location.hostname
        runtime.server.port = 5000
    }
    function loadLS() {
        runtime.server.address = serverJson.address
        runtime.server.port = serverJson.port
    }
}

function tryAuth(userUUID) {
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    const isPerm = document.getElementById("perm").checked
    axios.post((serverAddr + '/user/login'), {}, {
        headers: {
            X_UUID: userUUID,
            X_PERM: isPerm
        }
    })
    .then(function (response) {
        console.log(response);
        runtime.user.otp = response.data.message
        if (isPerm === true) {
            localStorage.setItem("X-OTP", runtime.user.otp)
        }
        console.log("go /")
        barba.go("/")
    })
    .catch(function (error) {
        console.log(error);
    });
}

function tryAuthFromForm() {
    const serverAddr = document.getElementById("server_addr").value
    const _temp = serverAddr.split(":")
    console.log(_temp)
    const serverIP = _temp[0]
    const serverPort = parseInt(_temp[1]) || 80
    runtime.server.address = serverIP
    runtime.server.port = serverPort
    localStorage.setItem("server", JSON.stringify(runtime.server))
    userUUID = calculateUUID()
    tryAuth(userUUID)
}

function calculateUUID() {
    const username = document.getElementById("username").value
    const password = CryptoJS.MD5(document.getElementById("password").value).toString()
    const calcUUID = `username:${username};password:${password}`
    userUUID = CryptoJS.SHA256(calcUUID).toString()
    if (document.getElementById("perm").checked === true) {
        localStorage.setItem("X-UUID", userUUID)
    }
    runtime.user.uuid = userUUID
    return userUUID
}

function checkAuth(otp, uuid) {
    const serverAddr = getServerAddrFromLS()
    axios.get((serverAddr + '/user'), {
        headers: {
            X_UUID: uuid,
            X_OTP: otp
        }
    })
    .then(function (response) {
        console.log(response)
        runtime.user.uuid = uuid
        runtime.user.otp = otp
        return true
    })
    .catch(function (error) {
        toLogin()
        console.log(error)
        return false
    });
}

function checkRememberMe() {
    var authOTP = localStorage.getItem("X-OTP")
    var authUUID = localStorage.getItem("X-UUID")
    console.log("checkRememberMe")
    if (authOTP === null && authUUID === null) {
        toLogin()
    } else {
        if (window.location.pathname !== "/login") {
            isAuthed = checkAuth(authOTP, authUUID)
            return isAuthed
        } else {
            clearLS()
        }
    }
    return true
}

function clearLS() {
    localStorage.removeItem("X-UUID")
    localStorage.removeItem("X-OTP")
}

function logout() {
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.delete((serverAddr + '/user/logout'), {
        headers: {
            X_UUID: runtime.user.uuid,
            X_OTP: runtime.user.otp
        }
    })
    .then(function (response) {
        console.log(response)
        toLogin()
        return true
    })
    .catch(function (error) {
        console.log(error)
        return false
    });
}

window.runtime = {
    versions: {},
    server: {
        init: {
            loadServer
        },
        functions: {
            getServerAddrFromLS
        }
    },
    user: {
        init: {
            checkRememberMe
        },
        functions: {
            tryAuth,
            tryAuthFromForm,
            toLogin,
            checkAuth,
            calculateUUID,
            clearLS,
            logout
        }
    },
    inited: {
        state: false
    },
}
