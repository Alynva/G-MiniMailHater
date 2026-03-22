import { Extension, HPacket, HDirection } from 'gnode-api'

const ext = new Extension({
	author: 'Alynva',
	description: 'Automatically get rid of the minimail notification.',
	name: "G-MiniMailHater",
	version: "1.0.0",
})

ext.run()

ext.on('connect', async () => {
	ext.writeToConsole(`G-MiniMailHater ready.`)
})

let onClickCallback = null
ext.on('click', () => {
	if (typeof onClickCallback === 'function')
		onClickCallback()
})

ext.interceptByNameOrHash(HDirection.TOCLIENT, "MiniMailNew", message => {
	message.blocked = true
})
ext.interceptByNameOrHash(HDirection.TOCLIENT, "MiniMailUnreadCount", message => {
	message.blocked = true
})

/**
 * @param {HDirection} direction
 * @param {HPacket} packet
 */
function safeSend(direction, packet) {
	try {
		if (typeof packet === 'string')
			packet = new HPacket(packet)

		if (direction === HDirection.TOCLIENT) ext.sendToClient(packet)
		if (direction === HDirection.TOSERVER) ext.sendToServer(packet)

		return true
	} catch (e) {
		console.error(e)
		console.error(`Couldn't send this packet:`, packet)
	}
}

function blockMessage(direction, packetName) {
	ext.interceptByNameOrHash(direction, packetName, message => {
		message.blocked = true
	})
}

function resetCount() {
	safeSend(HDirection.TOCLIENT, new HPacket(`{in:MiniMailUnreadCount}{i:0}`))
}

export default {
	onClicked: fc => onClickCallback = fc,
	resetCount,
	blockMessage,
}
