declare module "ignore" {
  interface IgnoreStructure {
    add: (rule: string | Array<string>) => IgnoreStructure;
    filter: (files: string | Array<string>) => string | Array<string>;
  }
  let ignore: () => IgnoreStructure;
  export = ignore;
}

declare module "hjson" {
    function parse (json: string): JSON
}

interface Object {
    assign(target: any, ...sources: any[]): any;
}