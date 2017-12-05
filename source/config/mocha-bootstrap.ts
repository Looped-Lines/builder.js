import {expect as _expect, use} from 'chai';
import chaiAsPromised = require('chai-as-promised');

use(chaiAsPromised);

(<any>global).expect = _expect;