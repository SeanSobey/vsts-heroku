import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

import * as task from 'vsts-task-lib/task';
import * as tool from 'vsts-task-tool-lib/tool';

// https://github.com/Microsoft/vsts-tasks/blob/master/Tasks/NodeToolV0
// https://github.com/GoogleCloudPlatform/google-cloud-tfs/blob/master/cloud-sdk-tool-build-task/

const versionSpec = '1.0.0'; // Heroku CLI is self updating

async function run(): Promise<void> {

	const toolPath = tool.findLocalTool('heroku', versionSpec) || await aquireTool();
	tool.prependPath(toolPath);
}

async function aquireTool(): Promise<string> {

	const platform = os.platform();
	const arch = os.arch();
	const downloadPath = await downloadTool(platform, arch);
	const extractPath = await extractTool(downloadPath, platform, arch);
	const toolRoot = path.join(extractPath, 'heroku');
	// const packagePath = path.join(toolRoot, 'package.json');
	// const version = require(packagePath).version;
	// const versionSpec = tool.cleanVersion(version);
	if (!task.getInput('disableCache', true)) {
		const cachedToolRoot = await tool.cacheDir(toolRoot, 'heroku', versionSpec, arch);
		return path.join(cachedToolRoot, 'bin');
	}
	return path.join(toolRoot, 'bin');
}

async function downloadTool(platform: string, arch: string): Promise<string> {

	try {
		const fileName = `heroku-${platform}-${arch}.tar.xz`;
		const tempDirectory = task.getVariable('Agent.TempDirectory');
		const filePath = path.join(tempDirectory, fileName);
		if (fs.existsSync(filePath)) {
			return filePath;
		}
		return await tool.downloadTool(`https://cli-assets.heroku.com/${fileName}`, fileName);
	} catch (error) {
		if (error.httpStatusCode && error.httpStatusCode === '404') {
			throw new Error(`Unsupported platform and/or architecture: ${platform}-${arch}`);
		}
		throw error;
	}
}

async function extractTool(downloadPath: string, platform: string, arch: string): Promise<string> {

	task.assertAgent('2.115.0');
	const tempDirectory = task.getVariable('Agent.TempDirectory');
	if (!tempDirectory) {
		throw new Error('Expected Agent.TempDirectory to be set');
	}
	const _7zPath = path.join(__dirname, '..', 'bin', '7z.exe');
	if (platform === 'win32') {
		const tarPath = path.join(tempDirectory, `heroku-${platform}-${arch}.tar`);
		if (!fs.existsSync(tarPath)) {
			await tool.extract7z(downloadPath, tempDirectory, _7zPath);
		}
		return await tool.extract7z(tarPath, tempDirectory, _7zPath);
	}
	const toolRunner = task.tool('tar');
	toolRunner.arg(['xC', tempDirectory, '-f', downloadPath]);
	await toolRunner.exec();
	return tempDirectory;
}

run()
	.then(() => {
		task.setResult(task.TaskResult.Succeeded, `Task done!`);
	})
	.catch((error: Error) => {
		task.setResult(task.TaskResult.Failed, error.message);
	});
