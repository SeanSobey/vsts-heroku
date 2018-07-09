"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const os = tslib_1.__importStar(require("os"));
const fs = tslib_1.__importStar(require("fs"));
const path = tslib_1.__importStar(require("path"));
const task = tslib_1.__importStar(require("vsts-task-lib/task"));
const tool = tslib_1.__importStar(require("vsts-task-tool-lib/tool"));
// https://github.com/Microsoft/vsts-tasks/blob/master/Tasks/NodeToolV0
// https://github.com/GoogleCloudPlatform/google-cloud-tfs/blob/master/cloud-sdk-tool-build-task/
const versionSpec = '1.0.0'; // Heroku CLI is self updating
function run() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const toolPath = tool.findLocalTool('heroku', versionSpec) || (yield aquireTool());
        tool.prependPath(toolPath);
    });
}
function aquireTool() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const platform = os.platform();
        const arch = os.arch();
        const downloadPath = yield downloadTool(platform, arch);
        const extractPath = yield extractTool(downloadPath, platform, arch);
        const toolRoot = path.join(extractPath, 'heroku');
        // const packagePath = path.join(toolRoot, 'package.json');
        // const version = require(packagePath).version;
        // const versionSpec = tool.cleanVersion(version);
        yield tool.cacheDir(toolRoot, 'heroku', versionSpec, arch);
        return path.join(toolRoot, 'bin');
    });
}
function downloadTool(platform, arch) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const fileName = `heroku-${platform}-${arch}.tar.xz`;
            const tempDirectory = task.getVariable('Agent.TempDirectory');
            const filePath = path.join(tempDirectory, fileName);
            if (fs.existsSync(filePath)) {
                return filePath;
            }
            return yield tool.downloadTool(`https://cli-assets.heroku.com/${fileName}`, fileName);
        }
        catch (error) {
            if (error.httpStatusCode && error.httpStatusCode === '404') {
                throw new Error(`Unsupported platform and/or architecture: ${platform}-${arch}`);
            }
            throw error;
        }
    });
}
function extractTool(downloadPath, platform, arch) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        task.assertAgent('2.115.0');
        const tempDirectory = task.getVariable('Agent.TempDirectory');
        if (!tempDirectory) {
            throw new Error('Expected Agent.TempDirectory to be set');
        }
        const _7zPath = path.join(__dirname, '..', 'bin', '7z.exe');
        const tarPath = path.join(tempDirectory, `heroku-${platform}-${arch}.tar`);
        if (platform === 'win32') {
            if (!fs.existsSync(tarPath)) {
                yield tool.extract7z(downloadPath, tempDirectory, _7zPath);
            }
            return yield tool.extract7z(tarPath, tempDirectory, _7zPath);
        }
        if (!fs.existsSync(tarPath)) {
            const toolRunner = task.tool('tar');
            toolRunner.arg(['xC', tempDirectory, '-f', downloadPath]);
            yield toolRunner.exec();
        }
        return yield tool.extractTar(tarPath);
    });
}
run()
    .then(() => {
    task.setResult(task.TaskResult.Succeeded, `Task done!`);
})
    .catch((error) => {
    task.setResult(task.TaskResult.Failed, error.message);
});
//# sourceMappingURL=index.js.map