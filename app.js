function encrypt() {
    const plaintext = document.getElementById('plaintext').value.toUpperCase();
    const key = document.getElementById('key').value.toUpperCase();
    
    if (!plaintext || !key) {
        alert('Please enter both plaintext and a key.');
        return;
    }
    
    document.getElementById('encryptionOutput').innerText = 'Encrypted Text: ' + processText(plaintext, key, 'encrypt');
}



function decrypt() {
    const ciphertext = document.getElementById('ciphertext').value.toUpperCase();
    const key = document.getElementById('decryptionKey').value.toUpperCase();
   
    if (!ciphertext || !key) {
        alert('Please enter both ciphertext and a key.');
        return;
    }
   
    document.getElementById('decryptionOutput').innerText = 'Decrypted Text: ' + processText(ciphertext, key, 'decrypt');
}

function processText(text, key, method) {
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        if (char.match(/[A-Z]/)) {
            const shift = key[keyIndex % key.length].charCodeAt(0) - 'A'.charCodeAt(0);
            const base = 'A'.charCodeAt(0);
            let updatedChar;
            if (method === 'encrypt') {
                updatedChar = (char.charCodeAt(0) - base + shift) % 26 + base;
            } else { // decrypt
                updatedChar = (char.charCodeAt(0) - base - shift + 26) % 26 + base;
            }
            result += String.fromCharCode(updatedChar);
            keyIndex++;
        } else {
            result += char;
        }
    }

    return result;
}