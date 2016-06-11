declare module "ignore" {
  interface addFunction {
      (rule: string | Array<string>): ignoreStructure;
  }
  interface filterFunction {
      (files: string | Array<string>): string | Array<string>;
  }
  interface ignoreStructure {
    add: addFunction;
    filter: filterFunction;
  }
  function main(): ignoreStructure;

  export = main;
}

declare module "hjson" {
    function parse (json: string): JSON
}