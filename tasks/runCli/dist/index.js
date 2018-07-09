"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const task = tslib_1.__importStar(require("vsts-task-lib/task"));
function run() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const apiKey = task.getInput('apiKey', true);
        const command = task.getInput('command', true);
        const tool = task.which('heroku');
        const toolRunner = task.tool(tool).line(command);
        const homeDirectory = task.getVariable('Agent.HomeDirectory');
        return yield toolRunner.exec({
            env: {
                HEROKU_API_KEY: apiKey,
                HOME: homeDirectory,
            }
        });
    });
}
exports.run = run;
run()
    .then((code) => {
    task.setResult(task.TaskResult.Succeeded, `Task done! Exit code: ${code}`);
})
    .catch((error) => {
    task.setResult(task.TaskResult.Failed, error.message);
});
//# sourceMappingURL=index.js.map