# Vigenere Cipher Web App

A modern, minimal Vigenere Cipher web app for encrypting and decrypting text directly in the browser. The project uses a dark glassmorphism interface, live cipher preview, case-preserving output, and session history to make the classic cipher easier to use and understand.

## Features

- Encrypt and decrypt messages with the Vigenere Cipher
- Toggle between Encrypt and Decrypt modes using tabs
- Live preview that updates as you type
- Optional preserve-case mode for case-sensitive output
- Copy result button with browser fallback support
- Clear input and output controls
- Session-based cipher history with copy and reuse actions
- Input validation for missing text, missing key, and invalid key characters
- Responsive dark theme with glassmorphism styling

## Preview

The app includes a centered cipher workspace with a separate history panel on larger screens. On smaller screens, the layout stacks cleanly for mobile use.

## How It Works

The Vigenere Cipher shifts each letter in a message using a repeating keyword.

For encryption:

```text
encrypted letter = (message letter + key letter) mod 26
```

For decryption:

```text
decrypted letter = (cipher letter - key letter + 26) mod 26
```

Spaces, punctuation, and numbers are preserved. Only letters are transformed.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/shivp1505/VigenereCipher.git
cd VigenereCipher
```

Open `index.html` directly in your browser, or run a simple local server:

```bash
python -m http.server 8000 --bind 127.0.0.1
```

Then visit:

```text
http://127.0.0.1:8000/
```

## Project Structure

```text
VigenereCipher/
├── index.html
├── style.css
├── app.js
└── README.md
```

## Tech Stack

- HTML
- CSS
- JavaScript

No frameworks or external build tools are required.

## Example

```text
Message: ATTACK AT DAWN
Key:     LEMON
Result:  LXFOPV EF RNHR
```

## Author

Created by Shiv Patel.
