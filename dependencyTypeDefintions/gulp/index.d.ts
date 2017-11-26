export namespace gulp {
    export function task(taskName: string, taskTriggers: string[], taskFunc?: Function): void;
    export function task(taskName: string, taskFunc: Function): void;
}