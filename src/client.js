import * as sapper from '@sapper/app';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';
import ackeeTracker from 'ackee-tracker'

UIkit.use(Icons);

ackeeTracker.create({
	server: 'https://analytics.skayo.dev',
	domainId: 'b9234509-bacd-4623-b4db-af3f12fee5da'
}).record()

sapper.start({
	target: document.querySelector('#sapper')
});
