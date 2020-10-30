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

function permissionStyleToggle() {
    var list = document.querySelectorAll("[hss-permission='admin']")
    if (runtime.user.details.type === "admin") {
        for (var i = 0; i < list.length; i++) {
            if (list[i].getAttribute("disabled") !== null) {
                list[i].removeAttribute("disabled")
            }
        }
    } else {
        for (var i = 0; i < list.length; i++) {
            if (list[i].getAttribute("disabled") !== null) {
                list[i].setAttribute("disabled", "")
            }
        }
    }
}

function checkUsernamePassword() {
    username = document.getElementById("username").value
    password = document.getElementById("password").value
    if (!isEmptyOrNull(username)) {
        document.getElementById("username").parentElement.classList.remove("mdui-textfield-invalid")
    } else {
        document.getElementById("username").parentElement.classList.add("mdui-textfield-invalid")
    }
    if (!isEmptyOrNull(password)) {
        document.getElementById("password").parentElement.classList.remove("mdui-textfield-invalid")
    } else {
        document.getElementById("password").parentElement.classList.add("mdui-textfield-invalid")
    }
    if (!isEmptyOrNull(username, password)) {
        return true
    } else {
        return false
    }
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

function renderDate(date) {
    if (date === -1) {
        return "Unknown"
    } else {
        return new Date(date).toLocaleString()
    }
}

function isEmptyOrNull() {
    isExists = true
    for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] === null) {
            isExists = true
            break
        } else if (arguments[i] === "") {
            isExists = true
            break
        } else if (arguments[i].replace(/\s+/g, "") === "") {
            isExists = true
            break
        } else {
            isExists = false
        }
    }
    return isExists
}

function detailsDialogForDevice() {
    document.getElementById("device-settings-uuid").innerText = arguments[0]
    document.getElementById("device-settings-key").innerText = arguments[1]
    document.getElementById("device-settings-ip").value = arguments[2]
    document.getElementById("device-settings-port").value = arguments[3]
    document.getElementById("device-settings-zone").value = arguments[4]
    document.getElementById("device-settings-type").value = arguments[5]
    document.getElementById("device-settings-name").value = arguments[6]
    var inst = new mdui.Dialog('#device-settings');
    inst.open()
}

function deleteDialogForDevice() {
    document.getElementById("device-deletion-uuid").innerText = arguments[0]
    document.getElementById("device-deletion-key").innerText = arguments[1]
    document.getElementById("device-deletion-ip").innerText = arguments[2]
    document.getElementById("device-deletion-port").innerText = arguments[3]
    document.getElementById("device-deletion-zone").innerText = arguments[4]
    document.getElementById("device-deletion-type").innerText = arguments[5]
    document.getElementById("device-deletion-name").innerText = arguments[6]
    var inst = new mdui.Dialog('#device-deletion');
    inst.open()
}

function renderDeviceForEvents(device, key) {
    if (device === null) {
        return "Unknown"
    } else {
        return device[key]
    }
}

function detailsDialogForEvent() {
    document.getElementById("event-settings-uuid").innerText = arguments[0]
    device = runtime.events.device_lut[arguments[0]]
    if (device === null) {
        document.getElementById("event-settings-devices").innerHTML = "Unknown"
    } else {
        document.getElementById("event-settings-devices").innerHTML = `<div><b>Zone: </b>${device.zone}</div><div><b>Type: </b>${device.type}</div><div><b>Name: </b>${device.name}</div>`
    }
    document.getElementById("event-settings-type").innerText = arguments[1]
    document.getElementById("event-settings-details").value = arguments[2]
    var inst = new mdui.Dialog('#event-settings');
    inst.open()
}

function deleteDialogForEvent() {
    document.getElementById("event-deletion-uuid").innerText = arguments[0]
    device = runtime.events.device_lut[arguments[0]]
    if (device === null) {
        document.getElementById("event-deletion-devices").innerHTML = "Unknown"
    } else {
        document.getElementById("event-deletion-devices").innerHTML = `<div><b>Zone: </b>${device.zone}</div><div><b>Type: </b>${device.type}</div><div><b>Name: </b>${device.name}</div>`
    }
    document.getElementById("event-deletion-type").innerText = arguments[1]
    document.getElementById("event-deletion-details").innerText = arguments[2]
    var inst = new mdui.Dialog('#event-deletion');
    inst.open()
}

function detailsDialogForUser() {
    document.getElementById("user-settings-uuid").innerText = arguments[0]
    document.getElementById("user-settings-name").value = arguments[1]
    document.getElementById("user-settings-type").value = arguments[2]
    var inst = new mdui.Dialog('#user-settings');
    inst.open()
}

function deleteDialogForUser() {
    var inst = new mdui.Dialog('#user-deletion');
    inst.open()
    document.getElementById("user-deletion-uuid").innerText = arguments[0]
    document.getElementById("user-deletion-name").innerText = arguments[1]
    document.getElementById("user-deletion-type").innerText = arguments[2]
}

function getFieldsForUpdating() {
    user_name = document.getElementById("update-user-name").value || null
    user_password = document.getElementById("update-user-password").value || null
    fields = {}
    if (checkPassword()) {
        if (!isEmptyOrNull(user_password)) {
            fields.password = CryptoJS.MD5(user_password).toString()
        }
    }
    if (!isEmptyOrNull(user_name)) {
        fields.username = user_name
    }
    if (Object.keys(fields).length === 0) {
        return null
    }
    return fields
}

function getFieldsForUpdatingForAdmin() {
    user_name = document.getElementById("user-settings-name").value || null
    user_password = document.getElementById("user-settings-password").value || null
    user_uuid = document.getElementById("user-settings-uuid").innerText || null
    user_type = document.getElementById("user-settings-type").value || null
    fields = {}
    if (!isEmptyOrNull(user_password)) {
        fields.password = CryptoJS.MD5(user_password).toString()
    }
    if (!isEmptyOrNull(user_name)) {
        fields.username = user_name
    }
    if (!isEmptyOrNull(user_uuid)) {
        fields.uuid = user_uuid
    }
    if (!isEmptyOrNull(user_type)) {
        fields.type = user_type
    }
    if (Object.keys(fields).length === 0) {
        return null
    }
    return fields
}

function getFieldsForUpdatingDevice() {
    deviceIP = document.getElementById("device-settings-ip").value || null
    devicePort = document.getElementById("device-settings-port").value || null
    deviceZone = document.getElementById("device-settings-zone").value || null
    deviceType = document.getElementById("device-settings-type").value || null
    deviceName = document.getElementById("device-settings-name").value || null
    fields = {}
    if (!isEmptyOrNull(deviceIP)) {
        fields.ip = deviceIP
    }
    if (!isEmptyOrNull(devicePort)) {
        fields.port = devicePort
    }
    if (!isEmptyOrNull(deviceZone)) {
        fields.zone = deviceZone
    }
    if (!isEmptyOrNull(deviceType)) {
        fields.type = deviceType
    }
    if (!isEmptyOrNull(deviceName)) {
        fields.name = deviceName
    }
    if (Object.keys(fields).length === 0) {
        return null
    }
    return fields
}

function getFieldsForUpdatingEvent() {
    eventDetails = document.getElementById("event-settings-details").value || null
    fields = {}
    if (!isEmptyOrNull(eventDetails)) {
        fields.what = eventDetails
    }
    if (Object.keys(fields).length === 0) {
        return null
    }
    return fields
}

function checkPassword() {
    user_password = document.getElementById("update-user-password").value || null
    user_password_confirm = document.getElementById("confirm-user-password").value || null
    if (user_password !== user_password_confirm) {
        document.getElementById("update-user-password").parentElement.classList.add("mdui-textfield-invalid")
        document.getElementById("confirm-user-password").parentElement.classList.add("mdui-textfield-invalid")
        return false
    } else {
        document.getElementById("update-user-password").parentElement.classList.remove("mdui-textfield-invalid")
        document.getElementById("confirm-user-password").parentElement.classList.remove("mdui-textfield-invalid")
        return true
    }
}

function authUser(userUUID) {
    document.getElementById("hss-loading-bar").classList.remove("hss-hidden")
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    const isPerm = document.getElementById("perm").checked
    axios.post((serverAddr + '/user/login'), {}, {
        headers: {
            X_UUID: userUUID,
            X_PERM: isPerm
        }
    })
    .then(function (response) {
        runtime.user.otp = response.data.message
        if (isPerm === true) {
            localStorage.setItem("X-OTP", runtime.user.otp)
        }
        console.log("go /")
        barba.go("/")
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                document.getElementById("username").parentElement.classList.add("mdui-textfield-invalid")
                document.getElementById("password").parentElement.classList.add("mdui-textfield-invalid")
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                })
            } else if (error.response.status === 400) { 
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                })
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
    });
}

function tryAuthFromForm() {
    const serverAddr = document.getElementById("server_addr").value
    const _temp = serverAddr.split(":")
    const serverIP = _temp[0]
    const serverPort = parseInt(_temp[1]) || 80
    runtime.server.address = serverIP
    runtime.server.port = serverPort
    localStorage.setItem("server", JSON.stringify(runtime.server))
    userUUID = calculateUUID()
    authUser(userUUID)
}

function indexSetup() {
    if (document.querySelector("main").getAttribute("data-barba-namespace") === "index") {
        document.getElementById("index-username").innerText = ", " + runtime.user.details.username
    }
}

function logout() {
    document.getElementById("hss-loading-bar").classList.remove("hss-hidden")
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.delete((serverAddr + '/user/logout'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        toLogin()
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        }  else if (error.response.status === 400) { 
            mdui.snackbar({
                message: error.response.data.message,
                timeout: 2000
            })
        } else {
            errorDialog(error.response.status, error.response.text)
        }
        toLogin()
        return false
    });
}

function getDevices() {
    var progressBar = document.getElementById("device-loading")
    var tableBody = document.getElementById("devices-table-body")
    var refreshButton = document.getElementById("device-list-refresh")
    progressBar.style.opacity = 1
    tableBody.innerHTML = ""
    refreshButton.setAttribute("disabled", "")
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.get((serverAddr + '/devices'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        progressBar.style.opacity = 0
        runtime.devices.list = response.data.message
        if (runtime.devices.list === null) {
            mdui.snackbar({
                message: "No device is added",
                timeout: 2000
            })
        } else {
            for (var i = 0; i < runtime.devices.list.length; i++) {
                device = runtime.devices.list[i]
                document.getElementById("devices-table-body").innerHTML += `<tr>
                <td>${device.ip}</td><td>${device.port}</td><td>${device.zone}</td><td>${device.type}</td><td>${device.name}</td><td>${renderDate(device.pulse)}</td><td><button class="mdui-btn mdui-btn-icon mdui-color-theme-accent mdui-ripple" onclick="runtime.devices.functions.detailsDialog('${device.uuid}','${device.key}', '${device.ip}', '${device.port}', '${device.zone}','${device.type}','${device.name}')" hss-permission="admin" disabled><i class="mdui-icon material-icons">settings</i></button></td><td><button class="mdui-btn mdui-btn-icon mdui-color-theme-accent mdui-ripple" onclick="runtime.devices.functions.deleteDialog('${device.uuid}','${device.key}', '${device.ip}', '${device.port}', '${device.zone}','${device.type}','${device.name}')" hss-permission="admin" disabled><i class="mdui-icon material-icons">delete_forever</i></button></td></tr>`
            }
            if (runtime.user.details !== undefined) {
                permissionStyleToggle()
            }
        }
        refreshButton.removeAttribute("disabled")
        return true
    })
    .catch(function (error) {
        progressBar.style.opacity = 1
        document.getElementById("device-list-refresh").removeAttribute("disabled")
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 400) { 
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                })
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

function getEvents() {
    var progressBar = document.getElementById("events-loading")
    var tableBody = document.getElementById("events-table-body")
    var refreshButton = document.getElementById("event-list-refresh")
    progressBar.style.opacity = 1
    tableBody.innerHTML = ""
    refreshButton.setAttribute("disabled", "")
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.get((serverAddr + '/events'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        progressBar.style.opacity = 0
        runtime.events.list = response.data.message
        runtime.events.device_lut = {}
        if (runtime.events.list === null) {
            mdui.snackbar({
                message: "No event is received",
                timeout: 2000
            })
        } else {
            for (var i = 0; i < runtime.events.list.length; i++) {
                eventDetails = runtime.events.list[i]
                document.getElementById("events-table-body").innerHTML += `<tr><td>${renderDate(eventDetails.time)}</td><td>${renderDeviceForEvents(eventDetails.device, "zone")} - ${renderDeviceForEvents(eventDetails.device, "type")} - ${renderDeviceForEvents(eventDetails.device, "name")}</td><td>${eventDetails.type}</td><td>${eventDetails.details}</td><td><button class="mdui-btn mdui-btn-icon mdui-color-theme-accent mdui-ripple" onclick="runtime.events.functions.detailsDialog('${eventDetails.uuid}', '${eventDetails.type}', '${eventDetails.details}')" hss-permission="admin" disabled><i class="mdui-icon material-icons">settings</i></button></td><td><button class="mdui-btn mdui-btn-icon mdui-color-theme-accent mdui-ripple" onclick="runtime.events.functions.deleteDialog('${eventDetails.uuid}', '${eventDetails.type}', '${eventDetails.details}')" hss-permission="admin" disabled><i class="mdui-icon material-icons">delete_forever</i></button></td></tr>`
                runtime.events.device_lut[eventDetails.uuid] = eventDetails.device
            }
            if (runtime.user.details !== undefined) {
                permissionStyleToggle()
            }
        }
        refreshButton.removeAttribute("disabled")
        return true
    })
    .catch(function (error) {
        progressBar.style.opacity = 0
        refreshButton.removeAttribute("disabled")
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 400) { 
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                })
            } else {
                errorDialog(error.response.status, error.response.text)
            }
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
        indexSetup()
        permissionStyleToggle()
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            }  else if (error.response.status === 403 || error.response.status === 400) {
                document.getElementById("user-loading").style.opacity = 0
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

function getUsers() {
    var progressBar = document.getElementById("user-loading")
    var tableBody = document.getElementById("users-table-body")
    var refreshButton = document.getElementById("user-list-refresh")
    progressBar.style.opacity = 1
    tableBody.innerHTML = ""
    refreshButton.setAttribute("disabled", "")
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.get((serverAddr + '/users'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        progressBar.style.opacity = 0
        runtime.user.list = response.data.message
        if (runtime.user.list === null) {
            mdui.snackbar({
                message: "The system has no user added, please add user first"
            })
        } else {
            for (var i = 0; i < runtime.user.list.length; i++) {
                user = runtime.user.list[i]
                tableBody.innerHTML += `<tr><td>${user.username}</td><td>${user.type}</td><td>${renderDate(user.last_login)}</td><td><button class="mdui-btn mdui-btn-icon mdui-color-theme-accent mdui-ripple" onclick="runtime.user.functions.detailsDialog('${user.uuid}', '${user.username}', '${user.type}')"><i class="mdui-icon material-icons">settings</i></button></td><td><button class="mdui-btn mdui-btn-icon mdui-color-theme-accent mdui-ripple" onclick="runtime.user.functions.deleteDialog('${user.uuid}', '${user.username}', '${user.type}')"><i class="mdui-icon material-icons">delete_forever</i></button></td></tr>`
            }
            if (runtime.user.details !== undefined) {
                permissionStyleToggle()
            }
        }
        refreshButton.removeAttribute("disabled")
        return true
    })
    .catch(function (error) {
        progressBar.style.opacity = 0
        refreshButton.removeAttribute("disabled")
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 400) {
                document.getElementById("user-loading").style.opacity = 0
                mdui.snackbar({
                    message: error.response.data.message
                });
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

function updateUserFromAdmin() {
    fields = getFieldsForUpdatingForAdmin()
    if (fields === null) {
        mdui.snackbar({
            message: "All the fields are empty",
            timeout: 2000
        })
    }
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.put((serverAddr + '/user/update'), {
        fields: JSON.stringify(fields)
    }, {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        mdui.snackbar({
            message: response.data.message,
            timeout: 2000
        })
        if (fields.username === runtime.user.details.username) {
            toLogin()
        } else {
            runtime.user.functions.getUsers()
        }
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 400 || error.response.status === 404) {
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        
        return false
    });
}

function updateUser() {
    fields = getFieldsForUpdating()
    if (fields === null) {
        mdui.snackbar({
            message: "All the fields are empty",
            timeout: 2000
        })
    }
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.put((serverAddr + '/user/update'), {
        fields: JSON.stringify(fields)
    }, {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        mdui.snackbar({
            message: response.data.message,
            timeout: 2000
        })
        toLogin()
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 400 || error.response.status === 404) {
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

function updateDevice() {
    fields = getFieldsForUpdatingDevice()
    if (fields === null) {
        mdui.snackbar({
            message: "All the fields are empty",
            timeout: 2000
        })
    }
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.put((serverAddr + '/device/update'), {
        key: document.getElementById("device-settings-key").innerText,
        fields: JSON.stringify(fields)
    }, {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        mdui.snackbar({
            message: response.data.message,
            timeout: 2000
        })
        runtime.devices.functions.getDevices()
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 400 || error.response.status === 404) {
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

function updateEvent() {
    fields = getFieldsForUpdatingEvent()
    if (fields === null) {
        mdui.snackbar({
            message: "All the fields are empty",
            timeout: 2000
        })
    }
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.put((serverAddr + '/event/update'), {
        which: document.getElementById("event-settings-uuid").innerText,
        fields: JSON.stringify(fields)
    }, {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        mdui.snackbar({
            message: "Event is updated",
            timeout: 2000
        })
        runtime.events.functions.getEvents()
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 400 || error.response.status === 404) {
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

function deleteUser() {
    const uuid = document.getElementById("user-deletion-uuid").innerText
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.delete((serverAddr + '/user/delete'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        },
        data: {
            uuid
        }
    })
    .then(function (response) {
        mdui.snackbar({
            message: response.data.message,
            timeout: 2000
        })
        if (uuid === runtime.user.details.uuid) {
            toLogin()
        } else {
            runtime.user.functions.getUsers()
        }
        return true
    })
    .catch(function (error) {
        console.log(error)
        
        return false
    });
}

function deleteDevice() {
    const key = document.getElementById("device-deletion-key").innerText
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.delete((serverAddr + '/device/delete'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        },
        data: {
            key
        }
    })
    .then(function (response) {
        mdui.snackbar({
            message: response.data.message,
            timeout: 2000
        })
        runtime.devices.functions.getDevices()
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 400 || error.response.status === 404) {
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

function deleteEvent() {
    const uuid = document.getElementById("event-deletion-uuid").innerText
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.delete((serverAddr + '/event/delete'), {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        },
        data: {
            which: uuid
        }
    })
    .then(function (response) {
        mdui.snackbar({
            message: response.data.message,
            timeout: 2000
        })
        runtime.events.functions.getEvents()
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 400 || error.response.status === 404) {
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

function pluginOff() {
    const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
    axios.put((serverAddr + '/event/clear'), {}, {
        headers: {
            X_UUID: getUUID(),
            X_OTP: getOTP()
        }
    })
    .then(function (response) {
        mdui.snackbar({
            message: response.data.message,
            timeout: 2000
        })
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

function addDevice() {
    mdui.snackbar({
        message: 'Adding a new device, please wait...',
        timeout: 2000
    });
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
        document.getElementById("device-add-callback-key").innerText = response.data.message
        new mdui.Dialog('#device-add-callback-dialog').open()
        runtime.devices.functions.getDevices()
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 400 || error.response.status === 404) {
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

function addUser() {
    mdui.snackbar({
        message: 'Adding a new user, please wait...',
        timeout: 2000
    });
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
        mdui.snackbar({
            message: response.data.message,
            timeout: 2000
        })
        runtime.user.functions.getUsers()
        return true
    })
    .catch(function (error) {
        if (error.response !== undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 400 || error.response.status === 404) {
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.text)
            }
        }
        return false
    });
}

window.runtime = {
    versions: {},
    server: {
        init: {
            loadServer
        }
    },
    user: {
        functions: {
            authUser,
            tryAuthFromForm,
            logout,
            getUser,
            getUsers,
            addUser,
            updateUser,
            deleteUser,
            checkPassword,
            detailsDialog: detailsDialogForUser,
            updateUserFromAdmin,
            deleteDialog: deleteDialogForUser
        }
    },
    devices: {
        functions: {
            getDevices,
            addDevice,
            deleteDevice,
            updateDevice,
            detailsDialog: detailsDialogForDevice,
            deleteDialog: deleteDialogForDevice
        }
    },
    events: {
        functions: {
            getEvents,
            pluginOff,
            updateEvent,
            deleteEvent,
            detailsDialog: detailsDialogForEvent,
            deleteDialog: deleteDialogForEvent
        }
    },
    misc: {
        functions: {
            checkUsernamePassword,
            errorDialog
        }
    }
}
