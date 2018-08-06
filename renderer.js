const {remote} = require('electron')
const {app} = remote

var checkDefaultBtn = document.createElement('button')
var setDefaultBtn = document.createElement('button')
var removeDefaultBtn = document.createElement('button')

checkDefaultBtn.textContent = 'checkDefault'
checkDefaultBtn.addEventListener('click', () => {
    console.log('tel isDefaultProtocolClient: ' + app.isDefaultProtocolClient('tel'))
})

setDefaultBtn.textContent = 'setDefault'
setDefaultBtn.addEventListener('click', () => {
    app.setAsDefaultProtocolClient('tel')
})

removeDefaultBtn.textContent = 'removeDefault'
removeDefaultBtn.addEventListener('click', () => {
    app.removeAsDefaultProtocolClient('tel')
})


// Add elements to the body
document.body.appendChild(checkDefaultBtn)
document.body.appendChild(setDefaultBtn)
document.body.appendChild(removeDefaultBtn)