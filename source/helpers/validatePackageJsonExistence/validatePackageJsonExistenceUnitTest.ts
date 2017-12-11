import {validatePackageJsonExistence} from "./validatePackageJsonExistence";
import {copyAsync, existsAsync, mkdirAsync, removeAsync} from "fs-extra-promise";

const currentDir = process.cwd();

async function configureNpmProject() {
    let testWorkingDirectory = `${currentDir}/../npmFakeProject`;
    await mkdirAsync(testWorkingDirectory);
    await copyAsync(`${currentDir}/source/mocks/npmFakeProject`, `${testWorkingDirectory}`);
    return testWorkingDirectory;
}


describe('UNIT UNDER TEST: validatePackageJsonExistence', function () {
    describe('Given an empty project', function () {
        let testWorkingDirectory;
        beforeEach(async function () {
            testWorkingDirectory = `${currentDir}/../emptyProject`;
            await mkdirAsync(`${testWorkingDirectory}`);
            process.chdir(testWorkingDirectory);
        });

        describe('When validatePackageJsonExistence is run', function () {
            let promise;

            beforeEach(function () {
                promise = validatePackageJsonExistence(existsAsync)
            });

            it(`Then it should throw an error indicating the package.json doesn't exist`, async function () {
                await expect(promise).to.be.eventually.rejectedWith(`Cannot find a package.json file`)
            })
        });

        afterEach(async function () {
            process.chdir(currentDir);
            await removeAsync(testWorkingDirectory);
        })
    });

    describe('Given an npm project', function () {
        let testWorkingDirectory;
        beforeEach(async function () {
            testWorkingDirectory = await configureNpmProject();
            process.chdir(testWorkingDirectory);
        });

        describe('When validatePackageJsonExistence is run', function () {
            let promise;

            beforeEach(function () {
                promise = validatePackageJsonExistence(existsAsync)
            });

            it(`Then it should not throw and error`, async function () {
                await expect(promise).to.be.fulfilled
            })
        });

        afterEach(async function () {
            process.chdir(currentDir);
            await removeAsync(testWorkingDirectory);
        })
    });
});