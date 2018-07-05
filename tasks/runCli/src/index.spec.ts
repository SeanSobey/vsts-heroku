// import * as assert from 'assert';
// import * as path from 'path';
// import * as mockRun from 'vsts-task-lib/mock-run';

import * as app from './index';

//https://github.com/Microsoft/vsts-task-lib/blob/master/node/docs/stepbystep.md

describe('run()', () => {

	// it('should run', () => {

	// 	const taskPath = path.join(__dirname, 'index.js');
	// 	const taskRunner = new mockRun.TaskMockRunner(taskPath);
	// 	taskRunner.setInput('api_key', '424344'); //INPUT_API_KEY
	// 	taskRunner.setInput('command', '424344'); //INPUT_COMMAND
	// 	taskRunner.run();
	// });

	it('should run', async () => {

		await app.run();
	});
});
