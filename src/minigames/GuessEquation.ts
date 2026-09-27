const BOARD_ROWS = 6
const BOARD_COLS = 7;

export type EquationTokenKind = "number" | "equal" | "plus" | "minus" | "divide" | "multiply" | "invalid";

export interface EquationToken {
  kind: EquationTokenKind,
  lexeme: string,
};

export class GuessEquation {
  public board: string[][];
  public attempts: number = 0;
  public userId: string;
  public equation: string;

  public constructor(userId: string, equation: string) {
    const emptyRow = new Array(BOARD_COLS).fill("");
    this.board = new Array(BOARD_ROWS).fill(emptyRow);
    this.userId = userId;
    this.equation = equation.replace(/\s*/g, "");
  }

  public isValidAttempt(guess: string): boolean {
    guess = guess.replace(/\s*/g, "");

    if (guess.length > BOARD_COLS) return false;

    const tokens = this.tokenize(guess);
    if (tokens.some(t => t.kind == "invalid")) return false;

    const equalIndex = tokens.findIndex(t => t.kind == "equal");
    if (equalIndex == -1 || equalIndex != tokens.length - 2)
      return false;

    const result = tokens[equalIndex + 1];
    if (!result || result.kind != "number") return false;

    const expressionTokens = tokens.splice(0, equalIndex);
    const expressionResult = this.evaluate(expressionTokens);

    if (expressionResult != Number(result.lexeme)) return false;
    return true;
  }

  public attempt(guess: string): string[] {
    guess = guess.replace(/\s/g, "");

    const operators = {
      "+": "plus",
      "-": "minus",
      "/": "divide",
      "*": "multiply",
      "x": "multiply",
      "=": "equal",
    } as const;

    const normalize = (char: string) =>
      char === "x" ? "*" : char;

    const suffix = (char: string) =>
      char in operators
        ? operators[char as keyof typeof operators]
        : char;

    const result = Array<string>(BOARD_COLS).fill("");
    const remaining = new Map<string, number>();

    for (let i = 0; i < BOARD_COLS; i++) {
      const guessChar = normalize(guess[i]!);
      const equationChar = normalize(this.equation[i]!);

      if (guessChar === equationChar) {
        result[i] = `ok_${suffix(guess[i]!)}`;
      } else {
        remaining.set(
          equationChar,
          (remaining.get(equationChar) ?? 0) + 1,
        );
      }
    }

    for (let i = 0; i < BOARD_COLS; i++) {
      if (result[i]) continue;

      const guessChar = normalize(guess[i]!);
      const count = remaining.get(guessChar) ?? 0;

      if (count > 0) {
        result[i] = `invalid_${suffix(guess[i]!)}`;

        remaining.set(guessChar, count - 1);
      } else {
        result[i] = `wrong_${suffix(guess[i]!)}`;
      }
    }

    this.board[this.attempts++] = result;

    return result;
  }

  private tokenize(equation: string): EquationToken[] {
    const tokens: EquationToken[] = [];

    let cursor = 0;
    while (cursor < equation.length) {
      const char = equation[cursor]!;

      if (char >= "0" && char <= "9") {
        let lexeme = char;
        cursor++;

        while (
          cursor < equation.length &&
          equation[cursor]! >= "0" &&
          equation[cursor]! <= "9") {

          lexeme += equation[cursor++];
        }

        tokens.push({ kind: "number", lexeme });
        continue;
      }

      const token: EquationToken = { kind: "invalid", lexeme: char };

      switch (char) {
        case "+": {
          token.kind = "plus";
          break;
        }

        case "-": {
          token.kind = "minus";
          break;
        }

        case "x":
        case "*": {
          token.kind = "multiply";
          break;
        }

        case "/": {
          token.kind = "divide";
          break;
        }

        case "=": {
          token.kind = "equal";
          break;
        }
      }

      cursor++;
      tokens.push(token);
    }

    return tokens;
  }

  private evaluate(tokens: EquationToken[]): number {
    const precedence = {
      "+": 1,
      "-": 1,
      "/": 2,
      "*": 2,
      "x": 2,
    };

    const values: number[] = [];
    const operators: string[] = [];

    const apply = () => {
      const operator = operators.pop();

      const right = values.pop()!;
      const left = values.pop()!;

      switch (operator) {
        case "+":
          values.push(left + right);
          break;

        case "-":
          values.push(left - right);
          break;

        case "*":
        case "x":
          values.push(left * right);
          break;

        case "/":
          if (right == 0) values.push(0)
          else values.push(left / right);

          break;
      }
    }

    for (const token of tokens) {
      if (token.kind == "number") {
        values.push(Number(token.lexeme));
        continue;
      }

      const operator = token.lexeme;
      while (
        operators.length > 0 &&
        precedence[operators.at(-1) as keyof typeof precedence] >=
        precedence[operator as keyof typeof precedence]) {
        apply();
      }

      operators.push(operator);
    }

    while (operators.length > 0) apply();

    return values[0]!;
  }
}
