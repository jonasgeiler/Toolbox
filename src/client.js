import * as sapper from '@sapper/app';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import ackeeTracker from 'ackee-tracker'

UIkit.use(Icons);

ackeeTracker.create({
	server: 'https://analytics.skayo.dev',
	domainId: '4a712c06-1eee-4202-bcc1-f7bf0edf4d83'
}).record()

sapper.start({
	target: document.querySelector('#sapper')
});