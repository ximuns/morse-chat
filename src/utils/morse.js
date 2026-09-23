export const TEXT_TO_MORSE = {
    'А': '.-',
    'Б': '-...',
    'В': '.--',
    'Г': '--.',
    'Д': '-..',
    'Е': '.',
    'Ё': '.',
    'Ж': '...-',
    'З': '--..',
    'И': '..',
    'Й': '.---',
    'К': '-.-',
    'Л': '.-..',
    'М': '--',
    'Н': '-.',
    'О': '---',
    'П': '.--.',
    'Р': '.-.',
    'С': '...',
    'Т': '-',
    'У': '..-',
    'Ф': '..-.',
    'Х': '....',
    'Ц': '-.-.',
    'Ч': '---.',
    'Ш': '----',
    'Щ': '--.-',
    'Ъ': '--.--',
    'Ы': '-.--',
    'Ь': '-..-',
    'Э': '..-..',
    'Ю': '..--',
    'Я': '.-.-',

    ' ': ' / ',
}

export const MORSE_TO_TEXT = Object.entries(
    TEXT_TO_MORSE
).reduce((result, [letter, code]) => {
    if (letter !== ' ') {
        result[code] = letter
    }

    return result
}, {})

export function decodeMorse(code) {
    return MORSE_TO_TEXT[code] || ''
}

export function encodeText(text) {
    return text
        .toUpperCase()
        .split('')
        .map((char) => TEXT_TO_MORSE[char] || '')
        .join(' ')
        .replace(/\s+\/\s+/g, ' / ')
}

export function encodeWord(word) {
    return word
        .toUpperCase()
        .split('')
        .map(
            (char) =>
                TEXT_TO_MORSE[char] || ''
        )
        .join('/')
}