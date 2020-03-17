export function main(args: string[]): number {
  console.log((args[0]?.toString() || "?") + "hello world!");

  return 0;
}

process.exitCode = main(process.argv);


