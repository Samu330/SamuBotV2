const { fetchJson } = require('../utils/fetcher')

/**
 * Get Resi Information
 *
 * @param {string} ekspedisi - nama ekpedisi
 * @param {string} resi - no / kode resi
 */
module.exports = cekResi = (ekspedisi, resi) => new Promise((resolve, reject) => {
    fetchJson(`https://api.terhambar.com/resi?resi=${resi}&kurir=${ekspedisi}`)
        .then((result) => {
            if (result.status.code != 200 && result.status.description != 'OK') return resolve(result.status.description)
            // eslint-disable-next-line camelcase
            const { result: { summary, details, delivery_status, manifest } } = result
            const manifestText = manifest.map(x => `⏰ ${x.manifest_date} ${x.manifest_time}\n └ ${x.manifest_description}`)
            const resultText = `
📦 Datos de expedición
├ ${summary.courier_name}
├ Numero: ${summary.waybill_number}
├ Service: ${summary.service_code}
└ Publicado en: ${details.waybill_date}  ${details.waybill_time}
      
💁🏼‍♂️ Datos del remitente
├ Nombre: ${details.shippper_name}
└ Habla a: ${details.shipper_address1} ${details.shipper_city}
      
🎯 Datos del destinatario
├ Nombre: ${details.receiver_name}
└ Habla a: ${details.receiver_address1} ${details.receiver_city}
      
📮 Estado de entrega
└ ${delivery_status.status}
                 
🚧 POD Detail\n
${manifestText.join('\n')}`
            resolve(resultText)
        }).catch((err) => {
            console.error(err)
            reject(err)
        })
})
