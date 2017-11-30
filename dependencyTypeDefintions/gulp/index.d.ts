export namespace gulp {
    import WritableStream = NodeJS.WritableStream;

    export function task(taskName: string, taskTriggers: string[], taskFunc?: Function): void;
    export function task(taskName: string, taskFunc: Function): void;
    export function src(globPath: string): void;
    export function dest(path: string): WritableStream;
}