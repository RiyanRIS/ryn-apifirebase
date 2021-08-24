async function get(battery, phn_info) {

    if (battery.plugged) {
        var batttxt = `${battery.battery}% (Charging)`
    } else {
        var batttxt = `${battery.battery}%`
    }

    return ({
        msg: `*RisBot* _(1.0.0)_\n|\n|--*Status Baterai:* ${batttxt}\n|--*Jenis Device:* ${phn_info.device_manufacturer} ${phn_info.device_model}\n|--*Versi Whatsapp:* ${phn_info.wa_version}`,
    })
}

module.exports = {
    get
}