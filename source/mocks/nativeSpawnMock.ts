const {ChildProcess} = require('child_process');
import {Readable} from 'stream';

export function createNativeSpawnMock(command: string, data: string[], errors: string[], exitCode: number, exitError: string = null){
    let childDone = [];
    let mockedProcess = new ChildProcess();

    mockedProcess.stdout = new Readable();

    mockedProcess.stdout._read = function () {
        data.forEach((message) => this.emit('data', message));
        mockedProcess.emit('childDone', 'stdout');
    };

    mockedProcess.stderr = new Readable();

    mockedProcess.stderr._read = function () {
        errors.forEach((message) => this.emit('data', message));
        mockedProcess.emit('childDone', 'stderr');
    };

    mockedProcess.on('childDone', function (child) {
        childDone.push(child);

        if(childDone.includes('stderr') && childDone.includes('stdout'))
        {
            mockedProcess.emit('close', exitCode, exitError);
        }
    });

    return function () {
        return mockedProcess;
    }
}