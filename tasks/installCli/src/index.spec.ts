// import * as assert from 'assert';
import * as mocha from 'mocha';
import * as path from 'path';
import * as mockRun from 'vsts-task-lib/mock-run';

//https://github.com/Microsoft/vsts-task-lib/blob/master/node/docs/stepbystep.md

mocha.describe('run()', () => {

	mocha.it.skip('should run', () => {

		const taskPath = path.join(__dirname, 'index.js');
		const taskRunner = new mockRun.TaskMockRunner(taskPath);
		taskRunner.setInput('disableCache', 'false');
		taskRunner.run();
	});
});
