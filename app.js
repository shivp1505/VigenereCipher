const form = document.getElementById('cipherForm');
const messageInput = document.getElementById('messageInput');
const keyInput = document.getElementById('keyInput');
const messageLabel = document.getElementById('messageLabel');
const submitButton = document.getElementById('submitButton');
const clearButton = document.getElementById('clearButton');
const copyButton = document.getElementById('copyButton');
const preserveCaseInput = document.getElementById('preserveCaseInput');
const resultOutput = document.getElementById('resultOutput');
const formMessage = document.getElementById('formMessage');
const historyList = document.getElementById('historyList');
const clearHistoryButton = document.getElementById('clearHistoryButton');
const tabButtons = document.querySelectorAll('.tab-button');

let currentMode = 'encrypt';
let latestResult = '';
let historyItems = [];

tabButtons.forEach((button) => {
    button.addEventListener('click', () => {
        setMode(button.dataset.mode);
    });
});

form.addEventListener('submit', (event) => {
    event.preventDefault();
    runCipher();
});

clearButton.addEventListener('click', clearForm);
copyButton.addEventListener('click', copyResult);
clearHistoryButton.addEventListener('click', clearHistory);
messageInput.addEventListener('input', updateLivePreview);
keyInput.addEventListener('input', updateLivePreview);
preserveCaseInput.addEventListener('change', updateLivePreview);
historyList.addEventListener('click', handleHistoryClick);

function setMode(mode) {
    currentMode = mode;

    tabButtons.forEach((button) => {
        const isActive = button.dataset.mode === mode;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', isActive.toString());
    });

    const isEncrypting = mode === 'encrypt';
    messageLabel.textContent = isEncrypting ? 'Plaintext' : 'Ciphertext';
    messageInput.placeholder = isEncrypting ? 'Enter your message...' : 'Enter encrypted text...';
    submitButton.textContent = isEncrypting ? 'Encrypt Message' : 'Decrypt Message';
    clearStatus();
    updateLivePreview();
}

function runCipher() {
    const cipherResult = getCipherResult();

    if (!cipherResult.ok) {
        showStatus(cipherResult.message, 'error');
        return;
    }

    latestResult = cipherResult.result;
    resultOutput.textContent = latestResult;
    copyButton.disabled = false;
    addHistoryItem(cipherResult);
    showStatus(`${currentMode === 'encrypt' ? 'Encrypted' : 'Decrypted'} and saved to history.`, 'success');
}

function updateLivePreview() {
    const message = messageInput.value;
    const key = keyInput.value;

    if (!message && !key) {
        latestResult = '';
        resultOutput.textContent = 'Your transformed message will appear here.';
        clearStatus();
        return;
    }

    const cipherResult = getCipherResult();

    if (!cipherResult.ok) {
        latestResult = '';
        resultOutput.textContent = 'Your transformed message will appear here.';
        showStatus(cipherResult.message, 'error');
        return;
    }

    latestResult = cipherResult.result;
    resultOutput.textContent = latestResult;
    copyButton.disabled = false;
    showStatus('Live preview updated.', 'success');
}

function getCipherResult() {
    const message = messageInput.value;
    const key = keyInput.value.trim();

    if (!message.trim() || !key) {
        return { ok: false, message: 'Please enter both a message and a key.' };
    }

    if (!/[A-Za-z]/.test(message)) {
        return { ok: false, message: 'Your message needs at least one letter to transform.' };
    }

    if (!/^[A-Za-z]+$/.test(key)) {
        return { ok: false, message: 'Use letters only for the cipher key.' };
    }

    const preserveCase = preserveCaseInput.checked;
    const result = processText(message, key.toUpperCase(), currentMode, preserveCase);

    return {
        ok: true,
        mode: currentMode,
        input: message,
        key: key.toUpperCase(),
        preserveCase,
        result,
    };
}

function clearForm() {
    messageInput.value = '';
    keyInput.value = '';
    preserveCaseInput.checked = false;
    latestResult = '';
    resultOutput.textContent = 'Your transformed message will appear here.';
    copyButton.disabled = false;
    clearStatus();
    messageInput.focus();
}

async function copyResult() {
    if (!latestResult) {
        showStatus('Run the cipher before copying a result.', 'error');
        return;
    }

    const copied = await copyText(latestResult);

    if (copied) {
        showStatus('Result copied to clipboard.', 'success');
    } else {
        showStatus('Copy failed. Select the result text manually.', 'error');
    }
}

async function copyText(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
        } else {
            fallbackCopy(text);
        }
        return true;
    } catch (error) {
        try {
            fallbackCopy(text);
            return true;
        } catch (fallbackError) {
            return false;
        }
    }
}

function fallbackCopy(text) {
    const copyField = document.createElement('textarea');
    copyField.value = text;
    copyField.setAttribute('readonly', '');
    copyField.style.position = 'fixed';
    copyField.style.top = '-999px';
    copyField.style.left = '-999px';
    document.body.appendChild(copyField);
    copyField.select();

    const copied = document.execCommand('copy');
    document.body.removeChild(copyField);

    if (!copied) {
        throw new Error('Fallback copy failed');
    }
}

function showStatus(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
}

function clearStatus() {
    formMessage.textContent = '';
    formMessage.className = 'form-message';
}

function addHistoryItem(cipherResult) {
    const item = {
        id: Date.now().toString(),
        mode: cipherResult.mode,
        input: cipherResult.input,
        key: cipherResult.key,
        preserveCase: cipherResult.preserveCase,
        result: cipherResult.result,
    };

    historyItems = [item, ...historyItems].slice(0, 5);
    renderHistory();
}

function renderHistory() {
    if (historyItems.length === 0) {
        historyList.className = 'history-list empty';
        historyList.textContent = 'No history yet.';
        return;
    }

    historyList.className = 'history-list';
    historyList.innerHTML = historyItems.map((item) => `
        <article class="history-item">
            <div>
                <div class="history-meta">
                    <span>${item.mode === 'encrypt' ? 'Encrypted' : 'Decrypted'}</span>
                    <span>Key: ${escapeHtml(item.key)}</span>
                    <span>${item.preserveCase ? 'Case kept' : 'Uppercase'}</span>
                </div>
                <p class="history-result">${escapeHtml(item.result)}</p>
            </div>
            <div class="history-actions">
                <button class="mini-button" type="button" data-action="use" data-id="${item.id}">Use</button>
                <button class="mini-button" type="button" data-action="copy" data-id="${item.id}">Copy</button>
            </div>
        </article>
    `).join('');
}

async function handleHistoryClick(event) {
    const button = event.target.closest('button[data-action]');

    if (!button) {
        return;
    }

    const item = historyItems.find((historyItem) => historyItem.id === button.dataset.id);

    if (!item) {
        return;
    }

    if (button.dataset.action === 'copy') {
        const copied = await copyText(item.result);
        showStatus(copied ? 'History result copied.' : 'Copy failed. Select the result text manually.', copied ? 'success' : 'error');
        return;
    }

    setMode(item.mode);
    messageInput.value = item.input;
    keyInput.value = item.key;
    preserveCaseInput.checked = item.preserveCase;
    latestResult = item.result;
    resultOutput.textContent = item.result;
    showStatus('History item restored.', 'success');
}

function clearHistory() {
    historyItems = [];
    renderHistory();
    showStatus('History cleared.', 'success');
}

function escapeHtml(value) {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function processText(text, key, method, preserveCase) {
    let result = '';
    let keyIndex = 0;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];

        if (char.match(/[A-Za-z]/)) {
            const shift = key[keyIndex % key.length].charCodeAt(0) - 'A'.charCodeAt(0);
            const shouldUseLowercase = preserveCase && char >= 'a' && char <= 'z';
            const base = shouldUseLowercase ? 'a'.charCodeAt(0) : 'A'.charCodeAt(0);
            const normalizedChar = preserveCase ? char : char.toUpperCase();
            const updatedChar = method === 'encrypt'
                ? (normalizedChar.charCodeAt(0) - base + shift) % 26 + base
                : (normalizedChar.charCodeAt(0) - base - shift + 26) % 26 + base;

            result += String.fromCharCode(updatedChar);
            keyIndex++;
        } else {
            result += char;
        }
    }

    return result;
}
