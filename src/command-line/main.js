const prompt = require("prompt-sync")({ sigint: true });
const fs = require("fs");

/**
 * Takes a user provided string and encrypts it using the key
 * 
 * @param {string} plaintext 
 * @param {number} key 
 * @returns ciphertext
 */
function encrypt(plaintext, key)
{
    // Input error checking

    if (plaintext == "" || plaintext == undefined)
    {
        console.log("");
        console.log("Error: Plaintext cannot be empty.");
        return undefined;
    }

    const string_regex = /[^a-zA-Z\s!?,\.]/;
    if (plaintext.match(string_regex))
    {
        console.log("");
        console.log("Error: Plaintext can only contain letters, spaces, and basic punctuation.");
        return undefined;
    }

    if (typeof key != "number")
    {
        console.log("");
        console.log("Error: Key must be a number.");
        return undefined;
    }

    if (key < 1 || key > 25)
    {
        console.log("");
        console.log("Error: Key must be a number from 1 to 25.");
        return undefined;
    }

    let ciphertext = "";

    // Loop through every character in the plaintext
    for (const character of plaintext[Symbol.iterator]())
    {
        // Ignore special characters
        if (character.match(/[^a-zA-Z]/))
        {
           ciphertext = ciphertext.concat(character);
            continue;
        }

        let modulus = 90; // Uppercase unicode "Z" 
        if (character.match(/[a-z]/))
        {
            modulus = 122; // Lowercase unicode "z"
        }

        const plaintext_code = character.charCodeAt(0); // Unicode value of character

        // Calculate the unicode shift

        let ciphertext_code = plaintext_code + key;

        if (ciphertext_code > modulus)
        {
            // Loop back to the beginning of the alphabet
            ciphertext_code = (ciphertext_code % modulus) + (modulus - 26);
        }

        const ciphertext_character = String.fromCharCode(ciphertext_code);
        ciphertext = ciphertext.concat(ciphertext_character);

    }

    return ciphertext;
}

/**
 * Takes a user provided ciphertext and decrypts it using the key
 * 
 * @param {string} ciphertext 
 * @param {number} key 
 * @returns 
 */
function decrypt(ciphertext, key)
{
    // User input error checking

    if (ciphertext == "" || ciphertext == undefined)
    {
        console.log("");
        console.log("Error: Ciphertext cannot be empty.");
        return undefined;
    }

    const string_regex = /[^a-zA-Z\s!?,\.]/;
    if (ciphertext.match(string_regex))
    {
        console.log("");
        console.log("Error: Ciphertext can only contain letters, spaces, and basic punctuation.");
        return undefined;
    }

    if (typeof key != "number")
    {
        console.log("");
        console.log("Error: Key must be a number.");
        return undefined;
    }

    if (key < 1 || key > 25)
    {
        console.log("");
        console.log("Error: Key must be a number from 1 to 25.");
        return undefined;
    }

    let plaintext = "";

    // Loops through every character in ciphertext
    for (const character of ciphertext[Symbol.iterator]())
    {
        // Ignore special characters
        if (character.match(/[^a-zA-Z]/))
        {
           plaintext = plaintext.concat(character);
            continue;
        }

        let modulus = 90; // Unicode uppercase "Z"
        if (character.match(/[a-z]/))
        {
            modulus = 122; // Unicode lowercase "z"
        }

        const ciphertext_code = character.charCodeAt(0); // Unicode of this character

        // Calculate the unicode shift

        let plaintext_code = ciphertext_code - key;

        if (plaintext_code < modulus - 25) // Loop back to the end of the alphabet
        {
            plaintext_code = modulus - (modulus - plaintext_code) % 26;
        }

        const plaintext_character = String.fromCharCode(plaintext_code);
        plaintext = plaintext.concat(plaintext_character);

    }

    return plaintext;
}

/**
 * 
 * @param {string} ciphertext 
 * @param {path} filename 
 * @returns {[string, number]} cracked text and key
 */
function decipher(ciphertext, filename)
{
    // User input error checking

    if (ciphertext == "" || ciphertext == undefined)
    {
        console.log("");
        console.log("Error: Ciphertext cannot be empty.");
        return undefined;
    }

    const string_regex = /[^a-zA-Z\s!?,\.]/;
    if (ciphertext.match(string_regex))
    {
        console.log("");
        console.log("Error: Ciphertext can only contain letters, spaces, and basic punctuation.");
        return undefined;
    }

    if (!fs.existsSync(filename))
    {
        console.log("");
        console.log("Error: File does not exist: " + filename);
        return undefined;
    }

    const fileData = fs.readFileSync(filename, "utf8"); // Get dictionary file
    let plaintext = undefined;
    let key = undefined;

    // Loop 25 times (key 1-25)
    for (let i = 1; i < 25; i++)
    {
        // Try to decrypt ciphertext with i key

        const crackedText = decrypt(ciphertext, i); // Decrypt
        const crackedWords = crackedText.replaceAll(/[^a-zA-Z\s]/g, "").split(/\s/); // Get a list of words only
        const matchedWords = crackedWords.filter(word => fileData.includes(word)); // Keep words found in dictionary file

        //console.log("Cracked words: " + crackedWords);
        //console.log("Matched words: " + matchedWords);

        // The correct key is found if all words are present in the dictionary file

        if (crackedWords.length != matchedWords.length) continue;
        plaintext = crackedText;
        key = i;

        break;
    }

    return [plaintext, key];
}

// User input encrypt operation
function option1()
{
    console.log("\n\n");
    console.log("Selected operation: Encrypt");

    let ciphertext = ""; // Stores encrypted plaintext
    do {
        if (ciphertext === undefined) // Error
        {
            console.log("");
            const try_again = prompt("Do you want to try again? Input (y/n): ").toLowerCase();

            // Exit loop
            if (try_again != "y")
            {
                ciphertext = "Failed";
                continue;
            }

        }

        console.log("");

        const plaintext = prompt("Input plaintext: ");
        const key = Number(prompt("Input key: "));
        ciphertext = encrypt(plaintext, key); // Encrypt the plaintext
    } while (ciphertext === undefined); // Continue until the operation succeeds

    console.log("");
    console.log("Encrypted message:");
    console.log(ciphertext);
}

// User input decrypt operation
function option2()
{
    console.log("\n\n");
    console.log("Selected operation: Decrypt");

    let plaintext = ""; // Stores decrypted ciphertext
    do {
        if (plaintext === undefined) // Error
        {
            console.log("");
            const try_again = prompt("Do you want to try again? Input (y/n): ").toLowerCase();

            // Exit loop
            if (try_again != "y")
            {
                plaintext = "Failed.";
                continue;
            }

        }

        console.log("");

        const ciphertext = prompt("Input ciphertext: ");
        const key = Number(prompt("Input key: "));
        plaintext = decrypt(ciphertext, key); // Decryipt the ciphertext
    } while (plaintext === undefined); // Continue until the operation succeeds

    console.log("");
    console.log("Decrypted message:");
    console.log(plaintext);
}

// User input decipher operation
function option3()
{
    console.log("\n\n");
    console.log("Selected operation: Decipher");

    let plaintextWithKey = []; // Stores the cracked ciphertext and key [plaintext, key]
    do {
        if (plaintextWithKey === undefined) // Error
        {
            console.log("");
            const try_again = prompt("Do you want to try again? Input (y/n): ").toLowerCase();

            // Exit loop
            if (try_again != "y")
            {
                plaintextWithKey = ["", undefined];
                continue;
            }

        }

        console.log("");

        const ciphertext = prompt("Input ciphertext: ");
        const filename = prompt("Input filename: ");
        plaintextWithKey = decipher(ciphertext, filename); // Crack the ciphertext
    } while (plaintextWithKey === undefined); // Continue until the operation succeeds

    console.log("");
    if (plaintextWithKey[0] == "" && plaintextWithKey[1] === undefined)
    {
        console.log("Could not decipher message.");
    } else
    {
        console.log("Deciphered message and key:");
        console.log(plaintextWithKey);
    }
    
}

// Enter point
function main()
{
    console.log("==============================");
    console.log("\n");
    console.log("    Enhanced Caesar Cipher");
    console.log("         Brandon Key");

    // Main menu, loop until program ends
    while (true)
    {
        console.log("\n");
        console.log("==============================");
        console.log("Please select an operation:");
        console.log("1) Encrypt a message.");
        console.log("2) Decrypt a message.");
        console.log("3) Decipher an encrypted message.");
        console.log("9) Exit the program.");
        
        const operation = Number(prompt("Input selection: ")); // User operation selection
        switch (operation) {
            case 1: // Encrypt
                option1();
                break;
            case 2: // Decrypt
                option2();
                break;
            case 3: // Decipher
                option3();
                break;
            case 9: // Exit program
                console.log("\n\n");
                console.log("Exiting...");
                console.log("==============================");
                return;
            default: // Invalid input
                console.log("");
                console.log("Error: Please input a valid operation (1-3).");
                continue;
        }

    }

}

main();
