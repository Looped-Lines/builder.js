import {GitHubHelper} from '../helpers/gitHub';
import {gitClone} from './gitClone';
import {pathExists} from 'fs-extra'
import {expect} from 'chai';
import {run} from "../helpers/run";

describe('Given a git repository', function () {
    this.timeout(5000);
    const orgName = 'looped-lines-test-org',
        repoName = 'testrepo';

    beforeEach(async function () {
        process.chdir('../');
        const gitHubHelper = new GitHubHelper();
        await gitHubHelper.createRepo(orgName, repoName)
    });

    describe('when git clone is called', async function () {
        beforeEach(async function () {
            await gitClone(run, orgName, repoName);
        });

        it('should have cloned the repo', async function () {
            expect(await pathExists(`${repoName}/.git`)).to.be.true
        })
    })
});