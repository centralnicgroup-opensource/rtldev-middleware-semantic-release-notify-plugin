const args = process.argv.slice(2);

const arg = {};
let curOpt = null;

for (const argStr of args) {
    const thisOpt = argStr.trim();
    const opt = thisOpt.replace(/^\-+/, '');

    if (opt === thisOpt) {
        // Argument value
        if (curOpt) arg[curOpt] = opt;
        curOpt = null;
    } else {
        // Argument name
        curOpt = opt;
        arg[curOpt] = true;
    }
}

export default arg;
