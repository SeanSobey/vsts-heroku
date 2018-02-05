import path = require('path');
import task = require('vsts-task-lib/task');

async function run(): Promise<void> {
	try {
		process.env['HEROKU_API_KEY'] = task.getInput('api_key', true);
		const tool = path.resolve('./node_modules/.bin/heroku');
		const command = task.getInput('command', true);
		const toolRunner = task.tool(tool).arg(command);
		const code = await toolRunner.exec();
		console.log('Task done! Exit code: ' + code);
	} catch (err) {
		task.setResult(task.TaskResult.Failed, err.message);
	}
}

run();
