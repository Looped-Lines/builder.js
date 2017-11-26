# Builder JS

A library for defining build scripts using Javascript

## Developers

The tests should be executed inside a docker container. The docker file is included.

### Bash Alias

If you are using bash please add the `gulp-docker` alias to the `~/.bashrc`

```bash
alias gulp-docker='sudo docker run --env GITHUB_TOKEN=$(pass show github/Builder_JS_Tester_Token) --tty --volume $(pwd):/root/project/:z gulp'`
```

### Fish Function

If you are using [fish](https://fishshell.com/) please:

1. Add the `gulp-docker` function:

```fish
function gulp-docker
	sudo docker run --env GITHUB_TOKEN=(pass show github/Builder_JS_Tester_Token) --tty --volume (pwd):/root/project/:z gulp $argv
end
```

2. Save the fish function:
```fish
funcsave gulp-docker
```