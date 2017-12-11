export async function validatePackageJsonExistence( existsAsync) {
    const hasPackageJson = await existsAsync('package.json');

    if (!hasPackageJson) {
        throw Error(`Cannot find a package.json file`)
    }
}
