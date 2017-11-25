import * as GitHub from 'octocat';

export class GitHubHelper{
    private client;

    constructor(){
        const token = process.env.GITHUB_TOKEN;

        this.client = new GitHub({
            token: token
        });

        Object.freeze(this.client);
    }

    async createRepo(orgName, repoName) {
        await this.deleteRepo(orgName, repoName);
        await this.client.post(`/orgs/${orgName}/repos`, {
            name: repoName
        })
    }

    async deleteRepo(orgName, repoName) {
        const response = await this.client.get(`/users/${orgName}/repos`);
        const repoNames = response.body.map(repo => repo.name);

        if(repoNames.includes(repoName)) {
            await this.client.del(`/repos/${orgName}/${repoName}`)
        }
    }
}
