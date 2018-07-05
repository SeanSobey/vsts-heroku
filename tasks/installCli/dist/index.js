"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = tslib_1.__importStar(require("os"));
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const url_1 = require("url");
const task = tslib_1.__importStar(require("vsts-task-lib/task"));
const tool = tslib_1.__importStar(require("vsts-task-tool-lib/tool"));
// https://github.com/Microsoft/vsts-tasks/blob/master/Tasks/NodeToolV0
const versionSpec = '1.0.0'; // Heroku CLI is self updating
async function run() {
    const toolPath = tool.findLocalTool('heroku', versionSpec) || await aquireTool();
    tool.prependPath(toolPath);
}
async function aquireTool() {
    const platform = os.platform();
    const arch = os.arch();
    const downloadPath = await downloadTool(platform, arch);
    const extractPath = await extractTool(downloadPath, platform, arch);
    const toolRoot = path.join(extractPath, 'heroku');
    // const packagePath = path.join(toolRoot, 'package.json');
    // const version = require(packagePath).version;
    // const versionSpec = tool.cleanVersion(version);
    await tool.cacheDir(toolRoot, 'heroku', versionSpec, arch);
    return path.join(toolRoot, 'bin');
}
async function downloadTool(platform, arch) {
    try {
        const fileName = `heroku-${platform}-${arch}.tar.xz`;
        const tempDirectory = task.getVariable('Agent.TempDirectory');
        const filePath = path.join(tempDirectory, fileName);
        if (fs.existsSync(filePath)) {
            return filePath;
        }
        const url = new url_1.URL(fileName, `https://cli-assets.heroku.com`);
        return await tool.downloadTool(url.toString(), fileName);
    }
    catch (error) {
        if (error.httpStatusCode && error.httpStatusCode === '404') {
            throw new Error(`Unsupported platform and/or architecture: ${platform}-${arch}`);
        }
        throw error;
    }
}
async function extractTool(downloadPath, platform, arch) {
    task.assertAgent('2.115.0');
    const tempDirectory = task.getVariable('Agent.TempDirectory');
    if (!tempDirectory) {
        throw new Error('Expected Agent.TempDirectory to be set');
    }
    const _7zPath = path.join(__dirname, '..', 'bin', '7z.exe');
    const tarPath = path.join(tempDirectory, `heroku-${platform}-${arch}.tar`);
    if (!fs.existsSync(tarPath)) {
        await tool.extract7z(downloadPath, tempDirectory, _7zPath);
    }
    return tempDirectory;
    if (platform === 'win32') {
        return await tool.extract7z(tarPath, tempDirectory, _7zPath);
    }
    return await tool.extractTar(tarPath);
}
run()
    .then(() => {
    task.setResult(task.TaskResult.Succeeded, `Task done!`);
})
    .catch((error) => {
    task.setResult(task.TaskResult.Failed, error.message);
});
//# sourceMappingURL=index.js.map