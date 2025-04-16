/**
 * Custom declaration file for estree
 * This resolves the "Cannot find type definition file for 'estree'" error
 */

declare module 'estree' {
  // Include basic type placeholders that will satisfy TypeScript
  export interface Node {
    type: string;
    [key: string]: any;
  }
}
