import {SpawnOptions} from 'child_process';
import xs, {default as Stream} from 'xstream';
import {ChildProcess} from  'child_process';

export interface SpawnFunc{
    (command: string, args?: string[], options?: SpawnOptions): ChildProcess;
}

export function spawn(command: string, args: string, nativeSpawn: SpawnFunc) : { messages$: Stream<string>, completed: Promise<void>} {
    const argsArray: Array<string> = args.split(' ');
    const childProcess = nativeSpawn(command, argsArray);

    const messages$: Stream<string> = xs.create({
        start: listener => {
            const processListener = data => {
                listener.next(data.toString())
            };

            childProcess.stdout.on('data', processListener);
            childProcess.stderr.on('data', processListener)
        },
        stop: () => {

        }
    });

    const completed = new Promise<void>(function (resolve, reject) {
        childProcess.on('close', (exitCode) => {
            if(exitCode > 0){
                reject();
            } else {
                resolve()
            }
        })
    });

    return {
        messages$,
        completed
    }
}