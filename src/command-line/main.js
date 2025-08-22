const prompt = require("prompt-sync")({ sigint: true });

function encrypt(plaintext, key)
{
    console.log("");
    
    if (plaintext == "" || plaintext == undefined)
    {
        console.log("Error: Plaintext cannot be empty.");
        return undefined;
    }

    const string_regex = /[^a-zA-Z\s!?,\.]/;
    if (plaintext.match(string_regex))
    {
        console.log("Error: Plaintext can only contain letters, spaces, and basic punctuation.");
        return undefined;
    }

    if (typeof key != "number")
    {
        console.log("Error: Key must be a number.");
        return undefined;
    }

    if (key < 1 || key > 25)
    {
        console.log("Error: Key must be a number from 1 to 25.");
        return undefined;
    }

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
        let ciphertext_code = plaintext_code + key;

        if (ciphertext_code > modulus)
        {
            ciphertext_code = (ciphertext_code % modulus) + (modulus - 26);
        }

        const ciphertext_character = String.fromCharCode(ciphertext_code);
        ciphertext = ciphertext.concat(ciphertext_character);

    }

    return ciphertext;
}

function decrypt(ciphertext, key)
{
    console.log("");

    if (ciphertext == "" || ciphertext == undefined)
    {
        console.log("Error: Ciphertext cannot be empty.");
        return undefined;
    }

    const string_regex = /[^a-zA-Z\s!?,\.]/;
    if (ciphertext.match(string_regex))
    {
        console.log("Error: Ciphertext can only contain letters, spaces, and basic punctuation.");
        return undefined;
    }

    if (typeof key != "number")
    {
        console.log("Error: Key must be a number.");
        return undefined;
    }

    if (key < 1 || key > 25)
    {
        console.log("Error: Key must be a number from 1 to 25.");
        return undefined;
    }

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

        if (plaintext_code < modulus - 25)
        {
            plaintext_code = modulus - (modulus - plaintext_code) % 26;
        }

        const plaintext_character = String.fromCharCode(plaintext_code);
        plaintext = plaintext.concat(plaintext_character);

    }

    return plaintext;
}

function decipher()
{
    console.log("WIP: Not implemented yet.");
}

function main()
{
    console.log("==============================");
    console.log("\n");
    console.log("    Enhanced Caesar Cipher");
    console.log("         Brandon Key");

    while (true)
    {
        console.log("\n");
        console.log("==============================");
        console.log("Please select an operation:");
        console.log("1) Encrypt a message.");
        console.log("2) Decrypt a message.");
        console.log("3) Decipher an encrypted message.");
        console.log("9) Exit the program.");
        
        const operation = Number(prompt("Input selection: "));
        switch (operation) {
            case 1:
                console.log("\n\n");
                console.log("Selected operation: Encrypt");

                let ciphertext = "";
                do {
                    if (ciphertext === undefined)
                    {
                        console.log("");
                        const try_again = prompt("Do you want to try again? Input (y/n): ");
                        switch (try_again.toLowerCase()) {
                            case "y":
                                break;
                            case "n":
                            default:
                                ciphertext = "Failed.";
                                continue;
                        }
                    }

                    console.log("");

                    const plaintext = prompt("Input plaintext: ");
                    const key = Number(prompt("Input key: "));
                    ciphertext = encrypt(plaintext, key);
                } while (ciphertext === undefined);

                console.log("");
                console.log("Encrypted message:");
                console.log(ciphertext);

                break;
            case 2:
                console.log("\n\n");
                console.log("Selected operation: Decrypt");

                let plaintext = "";
                do {
                    if (plaintext === undefined)
                    {
                        console.log("");
                        const try_again = prompt("Do you want to try again? Input (y/n): ");
                        switch (try_again.toLowerCase()) {
                            case "y":
                                break;
                            case "n":
                            default:
                                plaintext = "Failed.";
                                continue;
                        }
                    }

                    console.log("");

                    const ciphertext = prompt("Input ciphertext: ");
                    const key = Number(prompt("Input key: "));
                    plaintext = decrypt(ciphertext, key);
                } while (plaintext === undefined);

                console.log("");
                console.log("Decrypted message:");
                console.log(plaintext);
                
                break;
            case 3:

                break;
            case 9:
                console.log("\n\n");
                console.log("Exiting...");
                console.log("==============================");
                return;
            default:
                console.log("");
                console.log("Error: Please input a valid operation (1-3).");
                continue;
        }

    }

}

main();
