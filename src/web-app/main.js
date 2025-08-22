function createInputElement(name)
{
    const input = document.createElement("input");
    input.id = name;
    input.placeholder = name;

    return input;
}

function createButtonElement(operation)
{
    const button = document.createElement("button");
    button.textContent = "Submit";
    button.onclick = () => {
        document.getElementById("error").innerHTML = "";
        document.getElementById("solution").innerHTML = "";

        let solution = "";

        switch(operation.toLowerCase()) {
            case "encrypt":
                solution = encrypt();
                break;
            case "decrypt":
                solution = decrypt();
                break;
            case "decipher":
                solution = decipher();
                break;
            default:
                console.log("Error: Could not find suitable operation function.");
                document.getElementById("error").innerHTML = "Internet error: Could not find suitable function for operation.";
                break;
        }

        if (solution == undefined)
        {
            solution = "Unable to find a solution.";
        }

        document.getElementById("solution").innerHTML = "Output: " + solution;
    }

    return button;
}

function showEncrypt()
{
    const inputs_div = document.getElementById("inputs");
    const plaintext_input = createInputElement("plaintext");
    const key_input = createInputElement("key");
    const submit_button = createButtonElement("encrypt");

    inputs_div.innerHTML = "";
    inputs_div.appendChild(plaintext_input);
    inputs_div.appendChild(key_input);
    inputs_div.appendChild(submit_button);
}

function showDecrypt()
{
    const inputs_div = document.getElementById("inputs");
    const ciphertext_input = createInputElement("ciphertext");
    const key_input = createInputElement("key");
    const submit_button = createButtonElement("decrypt");

    inputs_div.innerHTML = "";
    inputs_div.append(ciphertext_input);
    inputs_div.append(key_input);
    inputs_div.append(submit_button);
}

function showDecipher()
{
    const inputs_div = document.getElementById("inputs");
    inputs_div.innerHTML = "";
}

function changeOperation(operation)
{
    console.log("Selected operation: " + operation);

    switch (operation.toLowerCase()) {
        case "encrypt":
            showEncrypt();
            break;
        case "decrypt":
            showDecrypt();
            break;
        case "decipher":
            showDecipher();
            break;
        default:
            console.log("Error: No selected operation found.");
            document.getElementById("error").innerHTML = "Internal Error: Could not find a selected operation.";
            return;
    }

}

function encrypt()
{
    const plaintext = document.getElementById("plaintext").value;
    const key = Number(document.getElementById("key").value);

    if (plaintext == "" || plaintext == undefined)
    {
        document.getElementById("error").innerHTML = "Error: Plaintext cannot be empty.";
        return;
    }

    const string_regex = /[^a-zA-Z\s!?,\.]/;
    if (plaintext.match(string_regex))
    {
        document.getElementById("error").innerHTML = "Error: Plaintext can only contain letters, spaces, and basic punctuation.";
        return;
    }

    if (typeof key != "number")
    {
        document.getElementById("error").innerHTML = "Error: Key must be a number.";
        return;
    }

    if (key < 1 || key > 25)
    {
        document.getElementById("error").innerHTML = "Error: Key must be a number from 1 to 25.";
        return;
    }

    //console.log("Plaintext: " + plaintext);
    //console.log("Key: " + key);

    let ciphertext = "";

    for (const character of plaintext[Symbol.iterator]())
    {
        if (character.match(/[^a-zA-Z]/))
        {
           ciphertext = ciphertext.concat(character);
            continue;
        }

        let modulus = 90;
        if (character.match(/[a-z]/))
        {
            modulus = 122;
        }

        const plaintext_code = character.charCodeAt(0);
        //console.log("character code: " + character + " - " + plaintext_code);
        let ciphertext_code = plaintext_code + key;

        if (ciphertext_code > modulus)
        {
            ciphertext_code = (ciphertext_code % modulus) + (modulus - 26);
        }

        const ciphertext_character = String.fromCharCode(ciphertext_code);
        ciphertext = ciphertext.concat(ciphertext_character);

    }

    //console.log(ciphertext);
    return ciphertext;
}

function decrypt()
{
    const ciphertext = document.getElementById("ciphertext").value;
    const key = Number(document.getElementById("key").value);

    if (ciphertext == "" || ciphertext == undefined)
    {
        document.getElementById("error").innerHTML = "Error: Ciphertext cannot be empty.";
        return;
    }

    const string_regex = /[^a-zA-Z\s!?,\.]/;
    if (ciphertext.match(string_regex))
    {
        document.getElementById("error").innerHTML = "Error: Ciphertext can only contain letters, spaces, and basic punctuation.";
        return;
    }

    if (typeof key != "number")
    {
        document.getElementById("error").innerHTML = "Error: Key must be a number.";
        return;
    }

    if (key < 1 || key > 25)
    {
        document.getElementById("error").innerHTML = "Error: Key must be a number from 1 to 25.";
        return;
    }

    //console.log("Ciphertext: " + ciphertext);
    //console.log("Key: " + key);

    let plaintext = "";

    for (const character of ciphertext[Symbol.iterator]())
    {
        if (character.match(/[^a-zA-Z]/))
        {
           plaintext = plaintext.concat(character);
            continue;
        }

        let modulus = 90;
        if (character.match(/[a-z]/))
        {
            modulus = 122;
        }

        const ciphertext_code = character.charCodeAt(0);
        let plaintext_code = ciphertext_code - key;
        //console.log("Plaintext code: " + plaintext_code);

        if (plaintext_code < modulus - 25)
        {
            //plaintext_code = modulus - ((modulus - 26) - plaintext_code);
            plaintext_code = modulus - (modulus - plaintext_code) % 26;
            //console.log("New plaintext code: " + plaintext_code);
        }

        const plaintext_character = String.fromCharCode(plaintext_code);
        plaintext = plaintext.concat(plaintext_character);

    }

    //console.log(plaintext);
    return plaintext;
}

function decipher()
{
    console.log("WIP: Not implemented yet.");
    document.getElementById("error").innerHTML = "WIP: Not implemented yet.";
}

showEncrypt();
