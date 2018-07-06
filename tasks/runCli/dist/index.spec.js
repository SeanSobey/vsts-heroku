"use strict";
// import * as assert from 'assert';
// import * as path from 'path';
// import * as mockRun from 'vsts-task-lib/mock-run';
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const app = tslib_1.__importStar(require("./index"));
//https://github.com/Microsoft/vsts-task-lib/blob/master/node/docs/stepbystep.md
describe('run()', () => {
    // it('should run', () => {
    // 	const taskPath = path.join(__dirname, 'index.js');
    // 	const taskRunner = new mockRun.TaskMockRunner(taskPath);
    // 	taskRunner.setInput('api_key', '424344'); //INPUT_API_KEY
    // 	taskRunner.setInput('command', '424344'); //INPUT_COMMAND
    // 	taskRunner.run();
    // });
    it('should run', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield app.run();
    }));
});
//# sourceMappingURL=index.spec.js.map