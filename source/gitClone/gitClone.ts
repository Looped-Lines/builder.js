type RunFunction = (command: string, args: string, sudo?: boolean) => Promise<void>;

export function gitClone(run: RunFunction, orgName: string, repoName): Promise<void> {
    return run('git', `clone https://github.com/${orgName}/${repoName}.git`);
}