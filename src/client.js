import * as sapper from '@sapper/app';
import UIkit from 'uikit';
import Icons from 'uikit/dist/js/uikit-icons';

UIkit.use(Icons);

sapper.start({
	target: document.querySelector('#sapper')
});
