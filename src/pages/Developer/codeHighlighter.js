/**
 * Yengil, xavfsiz va aniq Syntax Highlighter
 * 2-rasmdagi VS Code Dark Modern / One Dark Pro ranglar palitrasi
 */

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export function highlightCode(code, lang = 'javascript') {
  if (!code) return ''

  const lines = code.split('\n')

  const highlightedLines = lines.map((line) => {
    // 1. Izohlar (Comments)
    let commentIdx = -1
    if (lang === 'python' || lang === 'shell' || lang === 'env') {
      commentIdx = line.indexOf('#')
    } else {
      commentIdx = line.indexOf('//')
      if (commentIdx === -1 && lang === 'php') {
        commentIdx = line.indexOf('#')
      }
    }

    let codePart = line
    let commentPart = ''

    if (commentIdx !== -1) {
      const before = line.slice(0, commentIdx)
      const singleQuotes = (before.match(/'/g) || []).length
      const doubleQuotes = (before.match(/"/g) || []).length
      const backticks = (before.match(/`/g) || []).length

      // Qo'shtirnoq ichidagi izoh belgilarini ajratish
      if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0 && backticks % 2 === 0) {
        codePart = line.slice(0, commentIdx)
        commentPart = line.slice(commentIdx)
      }
    }

    let res = escapeHtml(codePart)
    const tokens = []
    const addToken = (html) => {
      const id = `___TOK${tokens.length}___`
      tokens.push(html)
      return id
    }

    // 2. Stringlar (Double, Single, Template literals)
    res = res.replace(/(["'`])(?:(?=(\\?))\2[\s\S])*?\1/g, (match) => {
      // String ichidagi ${...} larni ranglash
      let inner = match
      if (inner.includes('${')) {
        inner = inner.replace(/\$\{([^}]+)\}/g, (m, varName) => {
          return `<span class="tok-operator">\${</span><span class="tok-variable">${varName}</span><span class="tok-operator">}</span>`
        })
      }
      return addToken(`<span class="tok-string">${inner}</span>`)
    })

    // 3. Kalit so'zlar (Keywords)
    const keywords = [
      'import', 'export', 'default', 'from', 'as', 'const', 'let', 'var',
      'function', 'return', 'if', 'else', 'for', 'while', 'switch', 'case',
      'break', 'continue', 'new', 'this', 'class', 'extends', 'super',
      'try', 'catch', 'finally', 'throw', 'async', 'await', 'static',
      'def', 'None', 'True', 'False', 'self', 'lambda', 'with', 'in', 'is', 'not', 'and', 'or',
      'public', 'private', 'protected', 'namespace', 'use',
      'type', 'interface', 'package'
    ]
    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g')
    res = res.replace(kwRegex, (match) => {
      return addToken(`<span class="tok-keyword">${match}</span>`)
    })

    // 4. Boolean / Maxsus qiymatlar
    const booleans = ['true', 'false', 'null', 'undefined']
    const boolRegex = new RegExp(`\\b(${booleans.join('|')})\\b`, 'g')
    res = res.replace(boolRegex, (match) => {
      return addToken(`<span class="tok-boolean">${match}</span>`)
    })

    // 5. Typescript / Python tiplari
    const types = ['string', 'number', 'boolean', 'any', 'void', 'dict', 'list', 'bytes', 'int', 'bool']
    const typeRegex = new RegExp(`\\b(${types.join('|')})\\b`, 'g')
    res = res.replace(typeRegex, (match) => {
      return addToken(`<span class="tok-type">${match}</span>`)
    })

    // 6. Teglar (JSX / HTML: &lt;div, &lt;/button&gt;)
    res = res.replace(/(&lt;\/?[a-zA-Z0-9_-]+)/g, (match) => {
      return addToken(`<span class="tok-tag">${match}</span>`)
    })
    res = res.replace(/(&gt;|\/&gt;)/g, (match) => {
      return addToken(`<span class="tok-tag">${match}</span>`)
    })

    // 7. Teg attributlari (masalan: className=, onClick=, style=)
    res = res.replace(/\b([a-zA-Z0-9_-]+)(?==)/g, (match) => {
      return addToken(`<span class="tok-attr">${match}</span>`)
    })

    // 8. Funksiyalar va metod chaqiruvlari (masalan: useState(, axios.get()
    res = res.replace(/\b([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, (match) => {
      return addToken(`<span class="tok-function">${match}</span>`)
    })

    // 9. Sonlar
    res = res.replace(/\b(\d+)\b/g, (match) => {
      return addToken(`<span class="tok-number">${match}</span>`)
    })

    // Tokenlarni qaytarish
    for (let i = 0; i < tokens.length; i++) {
      res = res.replace(`___TOK${i}___`, tokens[i])
    }

    // Izoh qismi (Comments)
    if (commentPart) {
      res += `<span class="tok-comment">${escapeHtml(commentPart)}</span>`
    }

    return res
  })

  return highlightedLines.join('\n')
}

/**
 * JSON ma'lumotlarini (Payload, Response Body) VS Code ranglarida chiroyli ranglash
 */
export function highlightJson(data) {
  if (data === null || data === undefined) return ''
  let jsonString = ''
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data)
      jsonString = JSON.stringify(parsed, null, 2)
    } catch {
      jsonString = data
    }
  } else {
    jsonString = JSON.stringify(data, null, 2)
  }

  const escaped = escapeHtml(jsonString)
  const jsonRegex = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g

  return escaped.replace(jsonRegex, (match) => {
    let cls = 'tok-number'
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'tok-attr' // Kalit nomi (och havorang)
      } else {
        cls = 'tok-string' // Matn qiymat (to'q sariq)
      }
    } else if (/true|false/.test(match)) {
      cls = 'tok-boolean' // Boolean (ko'k)
    } else if (/null/.test(match)) {
      cls = 'tok-keyword' // Null (binafsharang)
    }
    return `<span class="${cls}">${match}</span>`
  })
}
