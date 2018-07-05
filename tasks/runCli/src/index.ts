import * as task from 'vsts-task-lib/task';

export async function run(): Promise<number> {

	const apiKey = task.getInput('apiKey', true);
	const command = task.getInput('command', true);
	//process.env['HEROKU_API_KEY'] = apiKey;
	const tool = task.which('heroku');
	const toolRunner = task.tool(tool).arg(command);
	// toolRunner.on('debug', (message) => {
	// 	console.log(message);
	// });
	return await toolRunner.exec({
		env: {
			HEROKU_API_KEY: apiKey
		}
	} as any);
}

run()
	.then((code) => {
		task.setResult(task.TaskResult.Succeeded, `Task done! Exit code: ${code}`);
	})
	.catch((error: Error) => {
		task.setResult(task.TaskResult.Failed, error.message);
	});
