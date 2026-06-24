/**
 * Lightweight C++ syntax highlighter.
 * Returns HTML string with span-wrapped tokens for styling.
 */

const CPP_KEYWORDS = new Set([
  "auto","bool","break","case","catch","char","class","const","constexpr",
  "continue","default","delete","do","double","else","enum","explicit",
  "extern","false","float","for","friend","goto","if","inline","int","long",
  "mutable","namespace","new","noexcept","nullptr","operator","override",
  "private","protected","public","register","return","short","signed",
  "sizeof","static","static_cast","struct","switch","template","this",
  "throw","true","try","typedef","typeid","typename","union","unsigned",
  "using","virtual","void","volatile","while",
]);

const CPP_TYPES = new Set([
  "string","vector","pair","map","set","unordered_map","unordered_set",
  "queue","deque","stack","list","array","tuple","optional","variant",
  "unique_ptr","shared_ptr","size_t","int64_t","uint32_t","int32_t",
  "stringstream","ostringstream","istringstream","ifstream","ofstream",
  "cout","cin","endl","Input","Output","TestCase","Solution","ListNode","TreeNode",
]);

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function highlightCpp(code) {
  if (!code) return "";

  const lines = code.split("\n");
  const result = [];

  for (const line of lines) {
    let highlighted = "";
    let i = 0;

    while (i < line.length) {
      // Comments: //
      if (line[i] === "/" && line[i + 1] === "/") {
        highlighted += `<span class="cm">${escapeHtml(line.slice(i))}</span>`;
        i = line.length;
        continue;
      }

      // Preprocessor: #include, #define, etc.
      if (line.trimStart().startsWith("#") && i === line.length - line.trimStart().length) {
        highlighted += `<span class="pp">${escapeHtml(line.slice(i))}</span>`;
        i = line.length;
        continue;
      }

      // Strings
      if (line[i] === '"' || line[i] === "'") {
        const quote = line[i];
        let end = i + 1;
        while (end < line.length && line[end] !== quote) {
          if (line[end] === "\\") end++; // skip escaped
          end++;
        }
        end++; // include closing quote
        highlighted += `<span class="str">${escapeHtml(line.slice(i, end))}</span>`;
        i = end;
        continue;
      }

      // Numbers
      if (/[0-9]/.test(line[i]) && (i === 0 || !/[a-zA-Z_]/.test(line[i - 1]))) {
        let end = i;
        while (end < line.length && /[0-9.xXa-fA-F]/.test(line[end])) end++;
        highlighted += `<span class="num">${escapeHtml(line.slice(i, end))}</span>`;
        i = end;
        continue;
      }

      // Identifiers (keywords, types, functions)
      if (/[a-zA-Z_]/.test(line[i])) {
        let end = i;
        while (end < line.length && /[a-zA-Z0-9_]/.test(line[end])) end++;
        const word = line.slice(i, end);

        // Check for std:: prefix
        let fullWord = word;
        if (line.slice(end, end + 2) === "::") {
          let end2 = end + 2;
          while (end2 < line.length && /[a-zA-Z0-9_]/.test(line[end2])) end2++;
          fullWord = line.slice(i, end2);
        }

        if (CPP_KEYWORDS.has(word)) {
          highlighted += `<span class="kw">${escapeHtml(word)}</span>`;
        } else if (CPP_TYPES.has(word) || word.startsWith("std")) {
          highlighted += `<span class="tp">${escapeHtml(word)}</span>`;
        } else if (end < line.length && line[end] === "(") {
          highlighted += `<span class="fn">${escapeHtml(word)}</span>`;
        } else {
          highlighted += escapeHtml(word);
        }
        i = end;
        continue;
      }

      // Operators
      if (/[+\-*/%=<>!&|^~?:]/.test(line[i])) {
        highlighted += `<span class="op">${escapeHtml(line[i])}</span>`;
        i++;
        continue;
      }

      // Everything else
      highlighted += escapeHtml(line[i]);
      i++;
    }

    result.push(highlighted);
  }

  return result.join("\n");
}
