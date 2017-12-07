import {gitClone} from "./gitClone/gitClone";
import {npmInstall} from "./npmInstall/npmInstall";

export class Steps {
    static gitClone = gitClone;
    static npmInstall = npmInstall;
}
