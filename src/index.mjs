import { HDirection } from 'gnode-api'
import gearth from './services/gearth.mjs'

gearth.onClicked(() => gearth.resetCount())

gearth.blockMessage(HDirection.TOCLIENT, "MiniMailNew")
gearth.blockMessage(HDirection.TOCLIENT, "MiniMailUnreadCount")
