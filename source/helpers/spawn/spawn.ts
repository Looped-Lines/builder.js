import {SpawnOptions} from 'child_process';
import xs, {default as Stream} from 'xstream';
import {ChildProcess} from  'child_process';

export interface NativeSpawnFunc{
    (command: string, args?: string[], options?: SpawnOptions): ChildProcess;
}
export interface SpawnFunc{
    (command: string, nativeSpawn: NativeSpawnFunc) : { messages$: Stream<string>, completed: Promise<void>}
}

function mapCommandStringToArgsAndApp(command: string) {
    let commandArray: string[] = command.split(' ');
    let app = commandArray[0];
    let args: string[] = commandArray.slice(1, commandArray.length - 1);
    return {app, args};
}

export function spawn(command: string, nativeSpawn: NativeSpawnFunc) : { messages$: Stream<string>, completed: Promise<void>} {
    const {app, args} = mapCommandStringToArgsAndApp(command);

    const childProcess = nativeSpawn(app, args);

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