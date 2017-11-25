import {spawn} from 'child-process-promise';

export async function run(command: string, args: string, sudo: boolean = false) : Promise<void> {
    const argsArray: Array<string> = args.split(' ');

    if (sudo) {
        return spawn('sudo', [command, ...argsArray], {
            stdio: 'inherit'
        });
    } else {
        return spawn(command, argsArray, {stdio: 'inherit'});
    }
}