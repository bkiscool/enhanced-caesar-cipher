
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

    console.log("Plaintext: " + plaintext);
    console.log("Key: " + key);

    let ciphertext = "";

    for (const character of plaintext[Symbol.iterator]())
    {
        if (character.match(/[^a-zA-Z]/))
        {
           ciphertext == ciphertext.concat(character);
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

    console.log(ciphertext);

}

