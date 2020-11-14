const gitLastCommit = require("git-last-commit");

function getLastGitCommit() {
    return new Promise((res, rej) => {
        gitLastCommit.getLastCommit((err, commit) => {
            if (err) return rej(err);
            return res(commit);
        })
    })
}

module.exports = getLastGitCommit;