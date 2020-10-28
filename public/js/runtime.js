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

function getUUID() {
    if (runtime.user.uuid === undefined) {
        runtime.user.uuid = localStorage.getItem("X-UUID")
    }
    return runtime.user.uuid
}

function getOTP() {
    if (runtime.user.otp === undefined) {
        runtime.user.otp = localStorage.getItem("X-OTP")
    }
    return runtime.user.otp
}

function clearLS() {
    localStorage.removeItem("X-UUID")
    localStorage.removeItem("X-OTP")
}

function errorDialog(title, content) {
    document.getElementById("hss-error-dialog-title").textContent = title
    document.getElementById("hss-error-dialog-content").textContent = content
    new mdui.Dialog('#hss-error-dialog').open()
}

function logout() {
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.delete((serverAddr + '/user/logout'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        console.log(response)
        toLogin()
        return true
    })
    .catch(function (error) {
        console.log(error)
        runtime.misc.functions.errorDialog(error.response.status, error.response.data.message)
        toLogin()
        return false
    });
}

function getDevices() {
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.get((serverAddr + '/devices'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        document.getElementById("device-loading").style.opacity = 0
        runtime.devices.list = response.data.message
        if (runtime.devices.list === null) {

        } else {
            for (var i = 0; i < runtime.devices.list.length; i++) {
                device = runtime.devices.list[i]
                document.getElementById("devices-table-body").innerHTML += `<tr>
                <td>${device.ip}</td><td>${device.port}</td><td>${device.zone}</td><td>${device.type}</td><td>${device.name}</td><td>${device.pulse}</td><td>${device.uuid}</td></tr>`
            }
        }
        return true
    })
    .catch(function (error) {
        console.log(error.response)
        if (error.response.status === 401) {
            toLogin()
        }
        return false
    });
}

function getUser() {
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.get((serverAddr + '/user'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        runtime.user.details = response.data.message
        return true
    })
    .catch(function (error) {
        console.log(error)
        if (error.response.status === 401) {
            toLogin()
        }
        return false
    });
}

function getUsers() {
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.get((serverAddr + '/users'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        document.getElementById("user-loading").style.opacity = 0
        runtime.user.list = response.data.message
        if (runtime.user.list === null) {
            runtime.misc.functions.errorDialog("No user detail received", "The system has no user added, please add user first") // impossible
        } else {
            for (var i = 0; i < runtime.user.list.length; i++) {
                user = runtime.user.list[i]
                document.getElementById("users-table-body").innerHTML += `<tr><td>${user.username}</td><td>${user.type}</td><td>${user.email}</td><td>${user.uuid}</td></tr>`
            }
        }
        return true
    })
    .catch(function (error) {
        console.log(error)
        if (error.response.status === 401) {
            toLogin()
        } else {
            document.getElementById("user-loading").style.opacity = 0
            runtime.misc.functions.errorDialog(error.response.status, error.response.data.message)
        }
        return false
    });
}

function addDevice() {
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.post((serverAddr + '/device/add'), {
        ip: document.getElementById("new-device-ip").value,
        port: document.getElementById("new-device-port").value,
        type: document.getElementById("new-device-type").value,
        zone: document.getElementById("new-device-zone").value,
        name: document.getElementById("new-device-name").value
    },{
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        console.log(response)
        
        return true
    })
    .catch(function (error) {
        console.log(error)
        return false
    });
}

function addUser() {
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    const fields = {
        username: document.getElementById("new-user-name").value,
        password: CryptoJS.MD5(document.getElementById("new-user-password").value).toString(),
        type: document.getElementById("new-user-type").value
    }
    axios.post((serverAddr + '/user/add'), {
        fields: JSON.stringify(fields)
    },{
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        console.log(response)
        
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
        },
        functions: {
            tryAuth,
            tryAuthFromForm,
            toLogin,
            calculateUUID,
            clearLS,
            logout,
            getUUID,
            getOTP,
            getUser,
            getUsers,
            addUser
        }
    },
    devices: {
        functions: {
            getDevices,
            addDevice
        }
    },
    events: {

    },
    inited: {
        state: false
    },
    misc: {
        functions: {
            errorDialog
        }
    }
}
