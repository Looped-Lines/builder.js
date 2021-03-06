import {spawn , NativeSpawnFunc} from './spawn';
import {createNativeSpawnMock} from '../../mocks/nativeSpawnMock';

describe('Given a command line command that will produce messages via stdout and stderr', function () {
    let messages: Array<string> = [
            'message1',
            'message2',
            'message3',
            'message4',
            'message5'
        ],
        errors: Array<string> = [
            'error1',
            'error2',
            'error3',
            'error4',
            'error5'
        ],
        exitError: string = 'Something really bad happened';

    describe('And that command exits with a zero exit code', function () {
        let nativeSpawnMock: NativeSpawnFunc,
            actual: Array<string> = [];

        beforeEach(function () {
            nativeSpawnMock = createNativeSpawnMock('ping', messages, errors, 0)
        });

        describe('When the command has run', function () {
            beforeEach(async function () {
                const {completed, messages$} = spawn('ping -c 2 www.google.com', nativeSpawnMock);

                messages$.addListener({
                        next: (stdout) => {
                            actual.push(stdout)
                        },
                        error: err => {},
                        complete: () => {}
                    }
                );

                await completed;
            });

            it('Then it should have returned all the message from stdout and stderr in a single stream', function () {
                expect(actual).to.deep.equal(messages.concat(errors))
            });
        })
    });

    describe('And that command exits with a non-zero exit code and error message', function () {
        let nativeSpawnMock: NativeSpawnFunc,
            actual: Array<string> = [];

        beforeEach(function () {
            nativeSpawnMock = createNativeSpawnMock('ping', messages, errors, 124, exitError)
        });

        describe('When the command has run', function () {
            let result;

            beforeEach( function () {
                result = spawn('ping -c 2 www.google.com', nativeSpawnMock);

                result.messages$.addListener({
                        next: (stdout) => {
                            actual.push(stdout)
                        },
                        error: err => {},
                        complete: () => {}
                    }
                );
            });

            it('Then it should have returned all the message from stdout and stderr in a single stream', async function () {
                try {
                    await result.completed;
                } catch {
                    expect(actual).to.deep.equal(messages.concat(errors))
                }
            });

            it('Then it should return a rejected promise', function () {
                return expect(result.completed).to.eventually.be.rejectedWith(exitError);
            });
        });
    });
});

