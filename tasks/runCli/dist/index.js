"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const task = tslib_1.__importStar(require("vsts-task-lib/task"));
async function run() {
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