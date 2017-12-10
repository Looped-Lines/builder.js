import {gitClone} from "./gitClone/gitClone";
import {npmInstall} from "./npmInstall/npmInstall";
import {jspmInstall} from "./jspmInstall/jspmInstall";
import {gulp} from "./gulp/gulp";

export class Steps {
    static gitClone = gitClone;
    static npmInstall = npmInstall;
    static jspmInstall = jspmInstall;
    static gulp = gulp;
}
