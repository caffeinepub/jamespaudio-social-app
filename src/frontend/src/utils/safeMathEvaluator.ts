/**
 * Safe math expression evaluator without using eval()
 * Supports: numbers, +, -, *, /, parentheses, and whitespace
 */

type Token = {
  type: 'number' | 'operator' | 'lparen' | 'rparen';
  value: string | number;
};

export function safeMathEvaluate(expression: string): number | null {
  try {
    const tokens = tokenize(expression);
    if (!tokens) return null;
    
    const result = parseExpression(tokens, 0);
    if (result === null || result.index !== tokens.length) return null;
    
    return result.value;
  } catch {
    return null;
  }
}

function tokenize(expr: string): Token[] | null {
  const tokens: Token[] = [];
  let i = 0;
  
  while (i < expr.length) {
    const char = expr[i];
    
    // Skip whitespace
    if (/\s/.test(char)) {
      i++;
      continue;
    }
    
    // Numbers (including decimals)
    if (/\d/.test(char)) {
      let numStr = '';
      while (i < expr.length && /[\d.]/.test(expr[i])) {
        numStr += expr[i];
        i++;
      }
      const num = parseFloat(numStr);
      if (isNaN(num)) return null;
      tokens.push({ type: 'number', value: num });
      continue;
    }
    
    // Operators
    if (['+', '-', '*', '/'].includes(char)) {
      tokens.push({ type: 'operator', value: char });
      i++;
      continue;
    }
    
    // Parentheses
    if (char === '(') {
      tokens.push({ type: 'lparen', value: '(' });
      i++;
      continue;
    }
    
    if (char === ')') {
      tokens.push({ type: 'rparen', value: ')' });
      i++;
      continue;
    }
    
    // Invalid character
    return null;
  }
  
  return tokens;
}

type ParseResult = {
  value: number;
  index: number;
} | null;

function parseExpression(tokens: Token[], index: number): ParseResult {
  let result = parseTerm(tokens, index);
  if (!result) return null;
  
  while (result.index < tokens.length) {
    const token = tokens[result.index];
    if (token.type !== 'operator') break;
    if (token.value !== '+' && token.value !== '-') break;
    
    const nextTerm = parseTerm(tokens, result.index + 1);
    if (!nextTerm) return null;
    
    if (token.value === '+') {
      result = { value: result.value + nextTerm.value, index: nextTerm.index };
    } else {
      result = { value: result.value - nextTerm.value, index: nextTerm.index };
    }
  }
  
  return result;
}

function parseTerm(tokens: Token[], index: number): ParseResult {
  let result = parseFactor(tokens, index);
  if (!result) return null;
  
  while (result.index < tokens.length) {
    const token = tokens[result.index];
    if (token.type !== 'operator') break;
    if (token.value !== '*' && token.value !== '/') break;
    
    const nextFactor = parseFactor(tokens, result.index + 1);
    if (!nextFactor) return null;
    
    if (token.value === '*') {
      result = { value: result.value * nextFactor.value, index: nextFactor.index };
    } else {
      if (nextFactor.value === 0) return null; // Division by zero
      result = { value: result.value / nextFactor.value, index: nextFactor.index };
    }
  }
  
  return result;
}

function parseFactor(tokens: Token[], index: number): ParseResult {
  if (index >= tokens.length) return null;
  
  const token = tokens[index];
  
  // Number
  if (token.type === 'number') {
    return { value: token.value as number, index: index + 1 };
  }
  
  // Unary minus
  if (token.type === 'operator' && token.value === '-') {
    const factor = parseFactor(tokens, index + 1);
    if (!factor) return null;
    return { value: -factor.value, index: factor.index };
  }
  
  // Unary plus
  if (token.type === 'operator' && token.value === '+') {
    return parseFactor(tokens, index + 1);
  }
  
  // Parenthesized expression
  if (token.type === 'lparen') {
    const expr = parseExpression(tokens, index + 1);
    if (!expr) return null;
    if (expr.index >= tokens.length || tokens[expr.index].type !== 'rparen') {
      return null;
    }
    return { value: expr.value, index: expr.index + 1 };
  }
  
  return null;
}
