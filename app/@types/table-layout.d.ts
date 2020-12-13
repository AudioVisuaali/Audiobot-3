declare module "table-layout" {
  type TableOptions = {
    maxWidth?: number;
    noWrap?: boolean;
    noTrim?: boolean;
    break?: boolean;
    columns?: { left?: string; right?: string }[];
    ignoreEmptyColumns?: boolean;
    padding?: { left?: string; right?: string };
  };

  class Table {
    constructor(rows: unknown, options?: TableOptions);
    toString(): string;
  }

  // eslint-disable-next-line no-restricted-syntax
  export default Table;
}
