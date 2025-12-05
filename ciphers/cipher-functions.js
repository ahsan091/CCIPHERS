/* ============================================
   CIPHER FUNCTIONS & PAGE LOGIC
   ============================================ */

// Cipher Data & Algorithms
const cipherData = {
    caesar: {
        name: "Caesar Cipher",
        description: "One of the simplest encryption techniques where each letter is shifted by a fixed number of positions",
        details: "The Caesar Cipher, named after Julius Caesar who reportedly used it, is a substitution cipher where each letter in the plaintext is shifted a certain number of places down the alphabet. For example, with a shift of 3, A would become D, B would become E, and so on. While extremely simple to break with modern techniques, it represents one of the earliest attempts at cryptography and is an excellent introduction to encryption concepts.",
        hasKey: true,
        keyType: "number",
        securityLevel: 1,
        encrypt: function(text, key) {
            const shift = parseInt(key) % 26;
            let result = "";
            for (const char of text) {
                if (char.match(/[a-z]/i)) {
                    const base = char.toLowerCase() === char ? 97 : 65;
                    result += String.fromCharCode(base + ((char.charCodeAt(0) - base + shift) % 26));
                } else {
                    result += char;
                }
            }
            return result;
        },
        decrypt: function(text, key) {
            const shift = parseInt(key) % 26;
            let result = "";
            for (const char of text) {
                if (char.match(/[a-z]/i)) {
                    const base = char.toLowerCase() === char ? 97 : 65;
                    result += String.fromCharCode(base + ((char.charCodeAt(0) - base - shift + 26) % 26));
                } else {
                    result += char;
                }
            }
            return result;
        }
    },

    rot13: {
        name: "ROT13 Cipher",
        description: "Simple letter substitution cipher that replaces each letter with the letter 13 positions after it",
        details: "ROT13 (rotate by 13 places) is a special case of the Caesar cipher, where each letter is shifted 13 positions in the alphabet. Since the English alphabet has 26 letters, ROT13 is its own inverse - applying it twice returns the original text. This property makes it a popular method for hiding text (like spoilers or puzzle solutions) that readers can easily decode. ROT13 is not meant for security but for obscuring text from casual glances.",
        hasKey: false,
        securityLevel: 1,
        encrypt: function(text) {
            let result = "";
            for (const char of text) {
                if (char.match(/[a-z]/i)) {
                    const base = char.toLowerCase() === char ? 97 : 65;
                    result += String.fromCharCode(base + ((char.charCodeAt(0) - base + 13) % 26));
                } else {
                    result += char;
                }
            }
            return result;
        },
        decrypt: function(text) {
            return this.encrypt(text); // ROT13 is its own inverse
        }
    },

    atbash: {
        name: "Atbash Cipher",
        description: "Simple substitution cipher that maps each letter to its reverse position in the alphabet",
        details: "The Atbash Cipher is one of the oldest known encryption techniques, originally used for the Hebrew alphabet. It's a monoalphabetic substitution cipher that maps each letter to its reverse in the alphabet - A becomes Z, B becomes Y, and so on. Despite its simplicity, it has historical significance and appears in biblical texts like the Book of Jeremiah. The cipher requires no key as it's a fixed transformation, making it easy to use but also trivial to break.",
        hasKey: false,
        securityLevel: 1,
        encrypt: function(text) {
            let result = "";
            for (const char of text) {
                if (char.match(/[a-z]/i)) {
                    const base = char.toLowerCase() === char ? 97 : 65;
                    result += String.fromCharCode(base + 25 - (char.charCodeAt(0) - base));
                } else {
                    result += char;
                }
            }
            return result;
        },
        decrypt: function(text) {
            return this.encrypt(text); // Atbash is its own inverse
        }
    },

    vigenere: {
        name: "Vigenère Cipher",
        description: "Polyalphabetic substitution cipher that uses a keyword to determine variable shift values",
        details: "The Vigenère cipher is a method of encrypting alphabetic text by using a simple form of polyalphabetic substitution. A polyalphabetic cipher uses multiple substitution alphabets to encrypt the data. The encryption of the original text is done using the Vigenère square or Vigenère table. The table consists of the alphabets written out 26 times in different rows, each alphabet shifted cyclically to the left compared to the previous alphabet, corresponding to the 26 possible Caesar ciphers.",
        hasKey: true,
        keyType: "text",
        securityLevel: 2,
        encrypt: function(text, key) {
            const cleanKey = key.replace(/[^a-zA-Z]/g, "").toUpperCase();
            if (cleanKey.length === 0) return "Invalid key (must contain at least one letter)";
            
            let result = "";
            let j = 0;
            
            for (const char of text) {
                if (char.match(/[a-z]/i)) {
                    const base = char.toLowerCase() === char ? 97 : 65;
                    const p = char.charCodeAt(0) - base;
                    const k = cleanKey[j % cleanKey.length].charCodeAt(0) - 65;
                    result += String.fromCharCode(base + ((p + k) % 26));
                    j++;
                } else {
                    result += char;
                }
            }
            return result;
        },
        decrypt: function(text, key) {
            const cleanKey = key.replace(/[^a-zA-Z]/g, "").toUpperCase();
            if (cleanKey.length === 0) return "Invalid key (must contain at least one letter)";
            
            let result = "";
            let j = 0;
            
            for (const char of text) {
                if (char.match(/[a-z]/i)) {
                    const base = char.toLowerCase() === char ? 97 : 65;
                    const c = char.charCodeAt(0) - base;
                    const k = cleanKey[j % cleanKey.length].charCodeAt(0) - 65;
                    result += String.fromCharCode(base + ((c - k + 26) % 26));
                    j++;
                } else {
                    result += char;
                }
            }
            return result;
        }
    },

    playfair: {
        name: "Playfair Cipher",
        description: "Digraph substitution cipher that encrypts pairs of letters instead of single letters",
        details: "The Playfair cipher was the first practical digraph substitution cipher. The scheme was invented in 1854 by Charles Wheatstone but was named after Lord Playfair who promoted the use of the cipher. The technique encrypts pairs of letters (digraphs), instead of single letters as in the simple substitution cipher. The Playfair is significantly harder to break since the frequency analysis used for simple substitution ciphers does not work with it.",
        hasKey: true,
        keyType: "text",
        securityLevel: 2,
        createMatrix: function(key) {
            const used = new Array(26).fill(false);
            used[9] = true; // J is replaced with I
            
            let matrixKey = "";
            for (const char of key.toUpperCase()) {
                if (char.match(/[A-Z]/)) {
                    const charUpper = char === "J" ? "I" : char;
                    const index = charUpper.charCodeAt(0) - 65;
                    if (!used[index]) {
                        used[index] = true;
                        matrixKey += charUpper;
                    }
                }
            }
            
            for (let i = 0; i < 26; i++) {
                const char = String.fromCharCode(65 + i);
                if (char !== "J" && !used[i]) {
                    matrixKey += char;
                }
            }
            
            const matrix = [];
            for (let i = 0; i < 25; i += 5) {
                matrix.push(matrixKey.substring(i, i + 5).split(""));
            }
            return matrix;
        },
        findPosition: function(matrix, char) {
            for (let i = 0; i < 5; i++) {
                for (let j = 0; j < 5; j++) {
                    if (matrix[i][j] === char) {
                        return [i, j];
                    }
                }
            }
            return [0, 0];
        },
        encrypt: function(text, key) {
            const matrix = this.createMatrix(key);
            
            let processedText = "";
            for (const char of text) {
                if (char.match(/[a-zA-Z]/)) {
                    const charUpper = char.toUpperCase() === "J" ? "I" : char.toUpperCase();
                    processedText += charUpper;
                }
            }
            
            let i = 0;
            let preparedText = "";
            while (i < processedText.length) {
                if (i === processedText.length - 1) {
                    preparedText += processedText[i] + "X";
                    break;
                } else if (processedText[i] === processedText[i + 1]) {
                    preparedText += processedText[i] + "X";
                    i += 1;
                } else {
                    preparedText += processedText[i] + processedText[i + 1];
                    i += 2;
                }
            }
            
            if (preparedText.length % 2 !== 0) {
                preparedText += "X";
            }
            
            let result = "";
            for (let i = 0; i < preparedText.length; i += 2) {
                const char1 = preparedText[i];
                const char2 = preparedText[i + 1];
                const [row1, col1] = this.findPosition(matrix, char1);
                const [row2, col2] = this.findPosition(matrix, char2);
                
                if (row1 === row2) {
                    result += matrix[row1][(col1 + 1) % 5] + matrix[row2][(col2 + 1) % 5];
                } else if (col1 === col2) {
                    result += matrix[(row1 + 1) % 5][col1] + matrix[(row2 + 1) % 5][col2];
                } else {
                    result += matrix[row1][col2] + matrix[row2][col1];
                }
            }
            return result;
        },
        decrypt: function(text, key) {
            const matrix = this.createMatrix(key);
            
            let processedText = "";
            for (const char of text) {
                if (char.match(/[a-zA-Z]/)) {
                    const charUpper = char.toUpperCase() === "J" ? "I" : char.toUpperCase();
                    processedText += charUpper;
                }
            }
            
            if (processedText.length % 2 !== 0) {
                processedText += "X";
            }
            
            let result = "";
            for (let i = 0; i < processedText.length; i += 2) {
                const char1 = processedText[i];
                const char2 = processedText[i + 1];
                const [row1, col1] = this.findPosition(matrix, char1);
                const [row2, col2] = this.findPosition(matrix, char2);
                
                if (row1 === row2) {
                    result += matrix[row1][(col1 - 1 + 5) % 5] + matrix[row2][(col2 - 1 + 5) % 5];
                } else if (col1 === col2) {
                    result += matrix[(row1 - 1 + 5) % 5][col1] + matrix[(row2 - 1 + 5) % 5][col2];
                } else {
                    result += matrix[row1][col2] + matrix[row2][col1];
                }
            }
            
            // Remove padding X's
            let cleaned = "";
            let idx = 0;
            while (idx < result.length) {
                cleaned += result[idx];
                if (idx + 2 < result.length && result[idx] === result[idx + 2] && result[idx + 1] === "X") {
                    idx += 2;
                } else {
                    idx += 1;
                }
            }
            
            if (cleaned && cleaned[cleaned.length - 1] === "X") {
                cleaned = cleaned.slice(0, -1);
            }
            
            return cleaned;
        }
    },

    "rail-fence": {
        name: "Rail Fence Cipher",
        description: "Transposition cipher that rearranges letters according to a zigzag pattern across multiple rows",
        details: "The Rail Fence cipher (also called a zigzag cipher) is a form of transposition cipher that gets its name from the way in which it is encoded. In the rail fence cipher, the plaintext is written downwards and diagonally on successive 'rails' of an imaginary fence, then moving up when the bottom rail is reached. When the top rail is reached, the message is written downwards again until the whole plaintext is written out. The message is then read off in rows.",
        hasKey: true,
        keyType: "number",
        securityLevel: 1,
        encrypt: function(text, key) {
            const rails = parseInt(key);
            if (rails <= 1) return text;
            
            const processedText = text.replace(/[^a-zA-Z]/g, "").toUpperCase();
            if (processedText.length === 0) return "";
            
            const fence = new Array(rails).fill("");
            let down = false;
            let row = 0;
            
            for (let i = 0; i < processedText.length; i++) {
                fence[row] += processedText[i];
                
                if (row === 0 || row === rails - 1) {
                    down = !down;
                }
                
                if (down) {
                    row += 1;
                } else {
                    row -= 1;
                }
            }
            
            return fence.join("");
        },
        decrypt: function(text, key) {
            const rails = parseInt(key);
            if (rails <= 1) return text;
            
            const processedText = text.replace(/[^a-zA-Z]/g, "").toUpperCase();
            const length = processedText.length;
            if (length === 0) return "";
            
            const fence = Array(rails).fill().map(() => Array(length).fill("\n"));
            
            let dirDown = null;
            let row = 0, col = 0;
            
            for (let i = 0; i < length; i++) {
                fence[row][col] = "*";
                
                if (row === 0) {
                    dirDown = true;
                } else if (row === rails - 1) {
                    dirDown = false;
                }
                
                if (dirDown) {
                    row += 1;
                } else {
                    row -= 1;
                }
                col += 1;
            }
            
            let index = 0;
            for (let i = 0; i < rails; i++) {
                for (let j = 0; j < length; j++) {
                    if (fence[i][j] === "*" && index < length) {
                        fence[i][j] = processedText[index];
                        index += 1;
                    }
                }
            }
            
            const result = [];
            row = 0;
            col = 0;
            dirDown = null;
            
            for (let i = 0; i < length; i++) {
                result.push(fence[row][col]);
                
                if (row === 0) {
                    dirDown = true;
                } else if (row === rails - 1) {
                    dirDown = false;
                }
                
                if (dirDown) {
                    row += 1;
                } else {
                    row -= 1;
                }
                col += 1;
            }
            
            return result.join("");
        }
    }
};

// Terminal output lines
function getTerminalLines(text, operation, cipherName) {
    return [
        `> INITIALIZING ${cipherName.toUpperCase()} ${operation.toUpperCase()} SEQUENCE`,
        `> ANALYZING INPUT TEXT: ${text.length} CHARACTERS`,
        `> APPLYING CRYPTOGRAPHIC TRANSFORMATION`,
        `> PROCESSING ALGORITHM PARAMETERS`,
        `> EXECUTING CIPHER OPERATIONS`,
        `> VERIFYING DATA INTEGRITY`,
        `> OPERATION COMPLETE`
    ];
}

// Initialize cipher page
function initCipherPage(cipherType) {
    const cipher = cipherData[cipherType];
    if (!cipher) {
        console.error("Cipher not found:", cipherType);
        return;
    }

    let currentMode = "encrypt";

    // Elements
    const inputText = document.getElementById("input-text");
    const outputText = document.getElementById("output-text");
    const cipherKey = document.getElementById("cipher-key");
    const processBtn = document.getElementById("process-btn");
    const processText = document.getElementById("process-text");
    const copyBtn = document.getElementById("copy-btn");
    const copyIcon = document.getElementById("copy-icon");
    const checkIcon = document.getElementById("check-icon");
    const terminalSection = document.getElementById("terminal-section");
    const terminalOutput = document.getElementById("terminal-output");
    const statusIndicator = document.getElementById("status-indicator");
    const statusText = document.getElementById("status-text");
    const inputCount = document.getElementById("input-count");
    const outputCount = document.getElementById("output-count");
    const detailsToggle = document.getElementById("details-toggle");
    const detailsContent = document.getElementById("details-content");
    const detailsChevron = document.getElementById("details-chevron");
    const modeBtns = document.querySelectorAll(".mode-btn");

    // Mode switching
    modeBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            modeBtns.forEach(b => b.classList.remove("active"));
            this.classList.add("active");
            currentMode = this.dataset.mode;
            processText.textContent = currentMode === "encrypt" ? "ENCRYPT TEXT" : "DECRYPT TEXT";
            inputText.placeholder = `Enter text to ${currentMode}...`;
        });
    });

    // Input character count
    if (inputText && inputCount) {
        inputText.addEventListener("input", function() {
            inputCount.textContent = this.value.length;
        });
    }

    // Hide key input if cipher doesn't need one
    if (!cipher.hasKey) {
        const keyGroup = document.querySelector(".key-group");
        if (keyGroup) {
            keyGroup.style.display = "none";
        }
    }

    // Process button click
    if (processBtn) {
        processBtn.addEventListener("click", function() {
            const input = inputText.value;
            if (!input) return;

            if (cipher.hasKey && cipherKey && !cipherKey.value) {
                alert("Please enter a key value");
                return;
            }

            // Show terminal
            terminalSection.classList.remove("hidden");
            terminalOutput.innerHTML = "";

            // Disable button
            processBtn.disabled = true;
            processText.textContent = "PROCESSING...";

            // Animate terminal output
            const lines = getTerminalLines(input, currentMode, cipher.name);
            let lineIndex = 0;

            const terminalInterval = setInterval(() => {
                if (lineIndex < lines.length) {
                    const lineDiv = document.createElement("div");
                    lineDiv.className = "terminal-line";
                    lineDiv.textContent = lines[lineIndex];
                    terminalOutput.appendChild(lineDiv);
                    terminalOutput.scrollTop = terminalOutput.scrollHeight;
                    lineIndex++;
                } else {
                    clearInterval(terminalInterval);

                    // Process the actual cipher
                    setTimeout(() => {
                        try {
                            let result;
                            if (currentMode === "encrypt") {
                                result = cipher.hasKey 
                                    ? cipher.encrypt(input, cipherKey.value)
                                    : cipher.encrypt(input);
                            } else {
                                result = cipher.hasKey
                                    ? cipher.decrypt(input, cipherKey.value)
                                    : cipher.decrypt(input);
                            }

                            outputText.value = result;
                            outputCount.textContent = result.length;

                            // Show status indicator
                            statusIndicator.classList.remove("hidden");
                            statusIndicator.classList.toggle("decrypt", currentMode === "decrypt");
                            statusText.textContent = currentMode === "encrypt" ? "ENCRYPTED" : "DECRYPTED";

                            // Show copy button
                            copyBtn.classList.remove("hidden");

                        } catch (error) {
                            outputText.value = "Error processing text. Please check your input.";
                        }

                        // Re-enable button
                        processBtn.disabled = false;
                        processText.textContent = currentMode === "encrypt" ? "ENCRYPT TEXT" : "DECRYPT TEXT";

                    }, 800);
                }
            }, 200);
        });
    }

    // Copy button
    if (copyBtn) {
        copyBtn.addEventListener("click", function() {
            if (!outputText.value) return;

            navigator.clipboard.writeText(outputText.value).then(() => {
                copyIcon.classList.add("hidden");
                checkIcon.classList.remove("hidden");

                setTimeout(() => {
                    copyIcon.classList.remove("hidden");
                    checkIcon.classList.add("hidden");
                }, 2000);
            });
        });
    }

    // Details toggle
    if (detailsToggle && detailsContent) {
        detailsToggle.addEventListener("click", function() {
            const isHidden = detailsContent.classList.contains("hidden");
            
            if (isHidden) {
                detailsContent.classList.remove("hidden");
                detailsToggle.classList.add("active");
            } else {
                detailsContent.classList.add("hidden");
                detailsToggle.classList.remove("active");
            }
        });
    }
}

// Coming Soon Page - Countdown
function initComingSoonCountdown() {
    const daysEl = document.getElementById("countdown-days");
    const hoursEl = document.getElementById("countdown-hours");
    const minutesEl = document.getElementById("countdown-minutes");
    const secondsEl = document.getElementById("countdown-seconds");

    if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

    // Set target date to 30 days from now
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 30);

    function updateCountdown() {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference <= 0) {
            daysEl.textContent = "0";
            hoursEl.textContent = "0";
            minutesEl.textContent = "0";
            secondsEl.textContent = "0";
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        daysEl.textContent = days;
        hoursEl.textContent = hours;
        minutesEl.textContent = minutes;
        secondsEl.textContent = seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}
