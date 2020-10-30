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

function checkPasswordForLogin() {
    password = document.getElementById("password").value
    if (!isEmptyOrNull(password)) {
        document.getElementById("password").parentElement.classList.remove("mdui-textfield-invalid")
    } else {
        document.getElementById("password").parentElement.classList.add("mdui-textfield-invalid")
    }
    if (!isEmptyOrNull(password)) {
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
    deviceIP = document.getElementById("device-settings-ip")
    devicePort = document.getElementById("device-settings-port")
    deviceZone = document.getElementById("device-settings-zone")
    deviceType = document.getElementById("device-settings-type")
    deviceName = document.getElementById("device-settings-name")
    deviceIP.parentElement.classList.remove("mdui-textfield-invalid-html5")
    devicePort.parentElement.classList.remove("mdui-textfield-invalid-html5")
    deviceZone.parentElement.classList.remove("mdui-textfield-invalid-html5")
    deviceType.parentElement.classList.remove("mdui-textfield-invalid-html5")
    deviceName.parentElement.classList.remove("mdui-textfield-invalid-html5")
    document.getElementById("device-settings-uuid").innerText = arguments[0]
    document.getElementById("device-settings-key").innerText = arguments[1]
    deviceIP.value = arguments[2]
    devicePort.value = arguments[3]
    deviceZone.value = arguments[4]
    deviceType.value = arguments[5]
    deviceName.value = arguments[6]
    runtime.misc.current_dialog = new mdui.Dialog('#device-settings');
    runtime.misc.current_dialog.open()
}

function deleteDialogForDevice() {
    document.getElementById("device-deletion-uuid").innerText = arguments[0]
    document.getElementById("device-deletion-key").innerText = arguments[1]
    document.getElementById("device-deletion-ip").innerText = arguments[2]
    document.getElementById("device-deletion-port").innerText = arguments[3]
    document.getElementById("device-deletion-zone").innerText = arguments[4]
    document.getElementById("device-deletion-type").innerText = arguments[5]
    document.getElementById("device-deletion-name").innerText = arguments[6]
    runtime.misc.current_dialog = new mdui.Dialog('#device-deletion');
    runtime.misc.current_dialog.open()
}

function addDialogForDevice() {
    deviceIP = document.getElementById("new-device-ip")
    devicePort = document.getElementById("new-device-port")
    deviceZone = document.getElementById("new-device-zone")
    deviceType = document.getElementById("new-device-type")
    deviceName = document.getElementById("new-device-name")
    deviceIP.parentElement.classList.remove("mdui-textfield-invalid-html5")
    devicePort.parentElement.classList.remove("mdui-textfield-invalid-html5")
    deviceType.parentElement.classList.remove("mdui-textfield-invalid-html5")
    deviceZone.parentElement.classList.remove("mdui-textfield-invalid-html5")
    deviceName.parentElement.classList.remove("mdui-textfield-invalid-html5")
    deviceIP.value = null
    devicePort.value = null
    deviceType.value = null
    deviceZone.value = null
    deviceName.value = null
    runtime.misc.current_dialog = new mdui.Dialog('#device-add');
    runtime.misc.current_dialog.open()
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
    runtime.misc.current_dialog = new mdui.Dialog('#event-settings');
    runtime.misc.current_dialog.open()
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
    runtime.misc.current_dialog = new mdui.Dialog('#event-deletion');
    runtime.misc.current_dialog.open()
}

function detailsDialogForUser() {
    document.getElementById("user-settings-uuid").innerText = arguments[0]
    username = document.getElementById("user-settings-name")
    password = document.getElementById("user-settings-password")
    type = document.getElementById("user-settings-type")
    username.parentElement.classList.remove("mdui-textfield-invalid-html5")
    password.parentElement.classList.remove("mdui-textfield-invalid-html5")
    username.value = arguments[1]
    password.value = null
    if (arguments[2] === "admin") {
        type.checked = true
    } else {
        type.checked = false
    }
    runtime.misc.current_dialog = new mdui.Dialog('#user-settings');
    runtime.misc.current_dialog.open()
}

function accountSettingsDialog() {
    username = document.getElementById("update-user-name")
    password = document.getElementById("update-user-password")
    passwordConfirm = document.getElementById("confirm-user-password")
    username.parentElement.classList.remove("mdui-textfield-invalid-html5")
    password.parentElement.classList.remove("mdui-textfield-invalid-html5")
    passwordConfirm.parentElement.classList.remove("mdui-textfield-invalid-html5")
    username.value = runtime.user.details.username
    password.value = null
    passwordConfirm.value = null
    runtime.misc.current_dialog = new mdui.Dialog('#account-settings');
    runtime.misc.current_dialog.open()
}

function deleteDialogForUser() {
    document.getElementById("user-deletion-uuid").innerText = arguments[0]
    document.getElementById("user-deletion-name").innerText = arguments[1]
    document.getElementById("user-deletion-type").innerText = arguments[2]
    runtime.misc.current_dialog = new mdui.Dialog('#user-deletion');
    runtime.misc.current_dialog.open()
}

function addDialogForUser() {
    username = document.getElementById("new-user-name")
    password = document.getElementById("new-user-password")
    type = document.getElementById("new-user-type")
    username.parentElement.classList.remove("mdui-textfield-invalid-html5")
    password.parentElement.classList.remove("mdui-textfield-invalid-html5")
    username.value = null
    password.value = null
    type.checked = false
    runtime.misc.current_dialog = new mdui.Dialog('#user-add');
    runtime.misc.current_dialog.open()
}

function getFieldsForUpdatingUser() {
    username = document.getElementById("update-user-name")
    password = document.getElementById("update-user-password")
    fields = {}
    invalidFields = []
    if (username.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Username")
        fields = null
    } else {
        if (!isEmptyOrNull(username.value) && fields !== null) {
            fields.username = username.value
        } else if (fields !== null) {
            username.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Username")
            fields = null
        } else if (isEmptyOrNull(username.value)) {
            username.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Details")
            fields = null
        }
    }
    if (checkPasswordForUser()) {
        if (password.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
            invalidFields.push("Password")
            fields = null
        } else {
            if (!isEmptyOrNull(password.value) && fields !== null) {
                fields.password = CryptoJS.MD5(password.value).toString()
            }
        }
    }
    
    return {
        fields,
        invalidFields: invalidFields.join(", ")
    }
}

function getFieldsForUpdatingUserForAdmin() {
    username = document.getElementById("user-settings-name")
    password = document.getElementById("user-settings-password")
    type = document.getElementById("user-settings-type")
    fields = {}
    invalidFields = []
    if (username.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Username")
        fields = null
    } else {
        if (!isEmptyOrNull(username.value) && fields !== null) {
            fields.username = username.value
        } else if (fields !== null) {
            username.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Username")
            fields = null
        } else if (isEmptyOrNull(username.value)) {
            username.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Details")
            fields = null
        }
    }
    if (password.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Password")
        fields = null
    } else {
        if (password.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
            invalidFields.push("Password")
            fields = null
        } else {
            if (!isEmptyOrNull(password.value) && fields !== null) {
                fields.password = CryptoJS.MD5(password.value).toString()
            }
        }
    }
    if (fields !== null) {
        if (type.checked) {
            fields.type = "admin"
        } else {
            fields.type = "regular"
        }
    }
    
    return {
        fields,
        invalidFields: invalidFields.join(", ")
    }
}

function getFieldsForUpdatingDevice() {
    deviceIP = document.getElementById("device-settings-ip")
    devicePort = document.getElementById("device-settings-port")
    deviceZone = document.getElementById("device-settings-zone")
    deviceType = document.getElementById("device-settings-type")
    deviceName = document.getElementById("device-settings-name")
    fields = {}
    invalidFields = []
    if (deviceIP.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("IP")
        fields = null
    } else {
        if (!isEmptyOrNull(deviceIP.value) && fields !== null) {
            fields.ip = deviceIP.value
        } else if (fields !== null) {
            deviceIP.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("IP")
            fields = null
        } else if (isEmptyOrNull(deviceIP.value)) {
            deviceIP.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("IP")
            fields = null
        }
    }
    if (devicePort.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Port")
        fields = null
    } else {
        if (!isEmptyOrNull(devicePort.value) && fields !== null) {
            fields.port = devicePort.value
        } else if (fields !== null) {
            devicePort.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Port")
            fields = null
        } else if (isEmptyOrNull(devicePort.value)) {
            devicePort.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Port")
            fields = null
        }
    }
    if (deviceZone.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Zone")
        fields = null
    } else {
        if (!isEmptyOrNull(deviceZone.value) && fields !== null) {
            fields.zone = deviceZone.value
        } else if (fields !== null) {
            deviceZone.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Zone")
            fields = null
        } else if (isEmptyOrNull(deviceZone.value)) {
            deviceZone.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Zone")
            fields = null
        }
    }
    if (deviceType.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Type")
        fields = null
    } else {
        if (!isEmptyOrNull(deviceType.value) && fields !== null) {
            fields.type = deviceType.value
        } else if (fields !== null) {
            deviceType.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Type")
            fields = null
        } else if (isEmptyOrNull(deviceType.value)) {
            deviceType.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Type")
            fields = null
        }
    }
    if (deviceName.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Name")
        fields = null
    } else {
        if (!isEmptyOrNull(deviceName.value) && fields !== null) {
            fields.name = deviceName.value
        } else if (fields !== null) {
            deviceName.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Name")
            fields = null
        } else if (isEmptyOrNull(deviceName.value)) {
            deviceName.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Name")
            fields = null
        }
    }
    return {
        fields,
        invalidFields: invalidFields.join(", ")
    }
}

function getFieldsForUpdatingEvent() {
    eventDetails = document.getElementById("event-settings-details")
    fields = {}
    invalidFields = []
    if (eventDetails.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Details")
        fields = null
    } else {
        if (!isEmptyOrNull(eventDetails.value) && fields !== null) {
            fields.what = eventDetails.value
        } else if (fields !== null) {
            eventDetails.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Details")
            fields = null
        } else if (isEmptyOrNull(eventDetails.value)) {
            eventDetails.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Details")
            fields = null
        }
    }
    return {
        fields,
        invalidFields: invalidFields.join(", ")
    }
}

function getFieldsForAddingDevice() {
    deviceIP = document.getElementById("new-device-ip")
    devicePort = document.getElementById("new-device-port")
    deviceZone = document.getElementById("new-device-zone")
    deviceType = document.getElementById("new-device-type")
    deviceName = document.getElementById("new-device-name")
    fields = {}
    invalidFields = []
    if (deviceIP.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("IP")
        fields = null
    } else {
        if (!isEmptyOrNull(deviceIP.value) && fields !== null) {
            fields.ip = deviceIP.value
        } else if (fields !== null) {
            deviceIP.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("IP")
            fields = null
        } else if (isEmptyOrNull(deviceIP.value)) {
            deviceIP.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("IP")
            fields = null
        }
    }
    if (devicePort.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Port")
        fields = null
    } else {
        if (!isEmptyOrNull(devicePort.value) && fields !== null) {
            fields.port = devicePort.value
        } else if (fields !== null) {
            devicePort.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Port")
            fields = null
        } else if (isEmptyOrNull(devicePort.value)) {
            devicePort.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Port")
            fields = null
        }
    }
    if (deviceZone.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Zone")
        fields = null
    } else {
        if (!isEmptyOrNull(deviceZone.value) && fields !== null) {
            fields.zone = deviceZone.value
        } else if (fields !== null) {
            deviceZone.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Zone")
            fields = null
        } else if (isEmptyOrNull(deviceZone.value)) {
            deviceZone.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Zone")
            fields = null
        }
    }
    if (deviceType.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Type")
        fields = null
    } else {
        if (!isEmptyOrNull(deviceType.value) && fields !== null) {
            fields.type = deviceType.value
        } else if (fields !== null) {
            deviceType.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Type")
            fields = null
        } else if (isEmptyOrNull(deviceType.value)) {
            deviceType.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Type")
            fields = null
        }
    }
    if (deviceName.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Name")
        fields = null
    } else {
        if (!isEmptyOrNull(deviceName.value) && fields !== null) {
            fields.name = deviceName.value
        } else if (fields !== null) {
            deviceName.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Name")
            fields = null
        } else if (isEmptyOrNull(deviceName.value)) {
            deviceName.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Name")
            fields = null
        }
    }
    return {
        fields,
        invalidFields: invalidFields.join(", ")
    }
}

function getFieldsForAddingUser() {
    username = document.getElementById("new-user-name")
    password = document.getElementById("new-user-password")
    type = document.getElementById("new-user-type")
    fields = {}
    invalidFields = []
    if (username.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Username")
        fields = null
    } else {
        if (!isEmptyOrNull(username.value) && fields !== null) {
            fields.username = username.value
        } else if (fields !== null) {
            username.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Username")
            fields = null
        } else if (isEmptyOrNull(username.value)) {
            username.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Details")
            fields = null
        }
    }
    if (password.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        invalidFields.push("Password")
        fields = null
    } else {
        if (!isEmptyOrNull(password.value) && fields !== null) {
            fields.password = CryptoJS.MD5(password.value).toString()
        } else if (fields !== null) {
            password.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Password")
            fields = null
        } else if (isEmptyOrNull(password.value)) {
            password.parentElement.classList.add("mdui-textfield-invalid-html5")
            invalidFields.push("Password")
            fields = null
        }
    }
    if (fields !== null) {
        if (type.checked) {
            fields.type = "admin"
        } else {
            fields.type = "regular"
        }
    }
    
    return {
        fields,
        invalidFields: invalidFields.join(", ")
    }
}

function checkPasswordForUser() {
    user_password = document.getElementById("update-user-password").value || null
    user_password_confirm = document.getElementById("confirm-user-password").value || null
    if (user_password !== user_password_confirm) {
        document.getElementById("update-user-password").parentElement.classList.add("mdui-textfield-invalid-html5")
        document.getElementById("confirm-user-password").parentElement.classList.add("mdui-textfield-invalid-html5")
        return false
    } else {
        document.getElementById("update-user-password").parentElement.classList.remove("mdui-textfield-invalid-html5")
        document.getElementById("confirm-user-password").parentElement.classList.remove("mdui-textfield-invalid-html5")
        return true
    }
}

function enterToLogin(e) {
    if (!e) { var e = window.event; }
    if (e.key === "Enter") { runtime.user.functions.tryAuthFromForm(); }
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
        barba.go("/")
    })
    .catch(function (error) {
        document.getElementById("hss-loading-bar").classList.add("hss-hidden")
        if (error.response === undefined) {
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
                errorDialog(error.response.status, error.response.data.message)
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
    username = document.getElementById("username")
    password = document.getElementById("password")
    if (!username.parentElement.classList.contains("mdui-textfield-invalid-html5") && !password.parentElement.classList.contains("mdui-textfield-invalid-html5")) {
        if (!isEmptyOrNull(username.value, password.value)) {
            userUUID = calculateUUID()
            authUser(userUUID)
        } else {
            mdui.snackbar({
                message: "Please enter your certificates",
                timeout: 2000
            })
        }
    } else {
        mdui.snackbar({
            message: "Invalid username and/or password",
            timeout: 2000
        })
    }
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
        document.getElementById("hss-loading-bar").classList.add("hss-hidden")
        if (error.response === undefined) {
            errorDialog("Error", error)
            console.error(error)
        }  else if (error.response.status === 400) { 
            mdui.snackbar({
                message: error.response.data.message,
                timeout: 2000
            })
        } else {
            errorDialog(error.response.status, error.response.data.message)
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
        if (error.response === undefined) {
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
                errorDialog(error.response.status, error.response.data.message)
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
        if (error.response === undefined) {
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
                errorDialog(error.response.status, error.response.data.message)
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
        if (error.response === undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            }  else if (error.response.status === 403) {
                document.getElementById("user-loading").style.opacity = 0
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.data.message)
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
        if (error.response === undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403) {
                document.getElementById("user-loading").style.opacity = 0
                refreshButton.setAttribute("disabled", "")
                mdui.snackbar({
                    message: error.response.data.message
                });
            } else {
                errorDialog(error.response.status, error.response.data.message)
            }
        }
        return false
    });
}

function updateUserFromAdmin() {
    data = getFieldsForUpdatingUserForAdmin()
    fields = data.fields
    invalidFields = data.invalidFields
    if (fields === null) {
        mdui.snackbar({
            message: `Invalid field(s): ${invalidFields}`,
            timeout: 2000
        })
    } else {
        runtime.misc.current_dialog.close()
        mdui.snackbar({
            message: 'Updating the user account, please wait...',
            timeout: 2000
        });
        fields.uuid = document.getElementById("user-settings-uuid").innerText
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
            if (error.response === undefined) {
                errorDialog("Error", error)
                console.error(error)
            } else {
                if (error.response.status === 401) {
                    toLogin()
                } else if (error.response.status === 403 || error.response.status === 404) {
                    mdui.snackbar({
                        message: error.response.data.message,
                        timeout: 2000
                    });
                } else {
                    errorDialog(error.response.status, error.response.data.message)
                }
            }
            
            return false
        });
    }
}

function updateUser() {
    data = getFieldsForUpdatingUser()
    fields = data.fields
    invalidFields = data.invalidFields
    if (fields === null) {
        mdui.snackbar({
            message: `Invalid field(s): ${invalidFields}`,
            timeout: 2000
        })
    } else {
        runtime.misc.current_dialog.close()
        mdui.snackbar({
            message: 'Updating your account, please wait...',
            timeout: 2000
        });
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
            if (error.response === undefined) {
                errorDialog("Error", error)
                console.error(error)
            } else {
                if (error.response.status === 401) {
                    toLogin()
                } else if (error.response.status === 403 || error.response.status === 404) {
                    mdui.snackbar({
                        message: error.response.data.message,
                        timeout: 2000
                    });
                } else {
                    errorDialog(error.response.status, error.response.data.message)
                }
            }
            return false
        });
    }
}

function updateDevice() {
    data = getFieldsForUpdatingDevice()
    fields = data.fields
    invalidFields = data.invalidFields
    if (fields === null) {
        mdui.snackbar({
            message: `Invalid field(s): ${invalidFields}`,
            timeout: 2000
        })
    } else {
        runtime.misc.current_dialog.close()
        mdui.snackbar({
            message: "Updating a new device, please wait...",
            timeout: 2000
        })
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
                message: `${response.data.message}`,
                timeout: 2000
            })
            runtime.devices.functions.getDevices()
            return true
        })
        .catch(function (error) {
            if (error.response === undefined) {
                errorDialog("Error", error)
                console.error(error)
            } else {
                if (error.response.status === 401) {
                    toLogin()
                } else if (error.response.status === 403 || error.response.status === 404) {
                    mdui.snackbar({
                        message: error.response.data.message,
                        timeout: 2000
                    });
                } else {
                    errorDialog(error.response.status, error.response.data.message)
                }
            }
            return false
        });
    }
}

function updateEvent() {
    data = getFieldsForUpdatingEvent()
    fields = data.fields
    invalidFields = data.invalidFields
    if (fields === null) {
        mdui.snackbar({
            message: `Invalid field(s): ${invalidFields}`,
            timeout: 2000
        })
    } else {
        runtime.misc.current_dialog.close()
        mdui.snackbar({
            message: 'Updating the event, please wait...',
            timeout: 2000
        });
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
            if (error.response === undefined) {
                errorDialog("Error", error)
                console.error(error)
            } else {
                if (error.response.status === 401) {
                    toLogin()
                } else if (error.response.status === 403 || error.response.status === 404) {
                    mdui.snackbar({
                        message: error.response.data.message,
                        timeout: 2000
                    });
                } else {
                    errorDialog(error.response.status, error.response.data.message)
                }
            }
            return false
        });
    }
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
        if (error.response === undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 404) {
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.data.message)
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
        if (error.response === undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else if (error.response.status === 403 || error.response.status === 404) {
                mdui.snackbar({
                    message: error.response.data.message,
                    timeout: 2000
                });
            } else {
                errorDialog(error.response.status, error.response.data.message)
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
        if (error.response === undefined) {
            errorDialog("Error", error)
            console.error(error)
        } else {
            if (error.response.status === 401) {
                toLogin()
            } else {
                errorDialog(error.response.status, error.response.data.message)
            }
        }
        return false
    });
}

function addDevice() {
    data = getFieldsForAddingDevice()
    fields = data.fields
    invalidFields = data.invalidFields
    if (fields === null) {
        mdui.snackbar({
            message: `Invalid field(s): ${invalidFields}`,
            timeout: 2000
        })
    } else {
        runtime.misc.current_dialog.close()
        mdui.snackbar({
            message: 'Adding a new device, please wait...',
            timeout: 2000
        });
        const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
        axios.post((serverAddr + '/device/add'), {
            ip: fields.ip,
            port: fields.port,
            type: fields.type,
            zone: fields.zone,
            name: fields.name
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
            if (error.response === undefined) {
                errorDialog("Error", error)
                console.error(error)
            } else {
                if (error.response.status === 401) {
                    toLogin()
                } else if (error.response.status === 403 || error.response.status === 404) {
                    mdui.snackbar({
                        message: error.response.data.message,
                        timeout: 2000
                    });
                } else {
                    errorDialog(error.response.status, error.response.data.message)
                }
            }
            return false
        });
    }
}

function addUser() {
    data = getFieldsForAddingUser()
    fields = data.fields
    invalidFields = data.invalidFields
    if (fields === null) {
        mdui.snackbar({
            message: `Invalid field(s): ${invalidFields}`,
            timeout: 2000
        })
    } else {
        runtime.misc.current_dialog.close()
        mdui.snackbar({
            message: 'Updating your account, please wait...',
            timeout: 2000
        });
        const serverAddr = "http://" + runtime.server.address + ":" + runtime.server.port
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
            if (error.response === undefined) {
                errorDialog("Error", error)
                console.error(error)
            } else {
                if (error.response.status === 401) {
                    toLogin()
                } else if (error.response.status === 404) {
                    mdui.snackbar({
                        message: error.response.data.message,
                        timeout: 2000
                    });
                } else {
                    errorDialog(error.response.status, error.response.data.message)
                }
            }
            return false
        });
    }
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
            checkPassword: checkPasswordForUser,
            detailsDialog: detailsDialogForUser,
            updateUserFromAdmin,
            deleteDialog: deleteDialogForUser,
            accountSettingsDialog,
            addDialogForUser,
            enterToLogin
        }
    },
    devices: {
        functions: {
            getDevices,
            addDevice,
            deleteDevice,
            updateDevice,
            detailsDialog: detailsDialogForDevice,
            deleteDialog: deleteDialogForDevice,
            addDialog: addDialogForDevice
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
            checkPassword: checkPasswordForLogin,
            errorDialog
        }
    }
}
