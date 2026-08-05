const bcrypt = require("bcrypt");

async function testhash() {

    const password = "admin123";

    const hash = await bcrypt.hash(password, 10);

    console.log(hash);
}

testhash();