import {MarkupContent, Node, Range as HtmlRange, TextDocument as HtmlTextDocument} from 'vscode-html-languageservice';
import {MarkdownString, Position, Range, TextDocument, Uri} from 'vscode';

export function toTextDocumentHtml(d: TextDocument): HtmlTextDocument {
  return {...d, uri: d.uri.toString()};
}

export function convertDocumentation(documentation: string | MarkupContent | undefined): string | MarkdownString | undefined {
  if (typeof documentation === 'object' && 'kind' in documentation) {
    if (documentation.kind == 'markdown') {
      return new MarkdownString(documentation.value);
    }
    return documentation.value;
  }
  return documentation;
}

export function hasAncestor(node: Node, name: string, includeSelf: boolean): boolean {
  if (!node.tag) return false;
  if (includeSelf && node.tag == name) return true;
  if (!node.parent) return false;
  return hasAncestor(node.parent, name, true);
}

export function getNodeTextContent(
    node: Node,
    document: TextDocument,
    whenTagName?: string,
    whenParentTagName?: string) {
  if (node.startTagEnd === undefined || node.endTagStart === undefined) return undefined;
  if (typeof whenTagName === 'string' && node.tag !== whenTagName) return undefined;
  if (typeof whenParentTagName === 'string' && node.parent?.tag !== whenParentTagName) return undefined;
  return getText(node.startTagEnd, node.endTagStart, document);
}

export function toRange(start: number, end: number, document: TextDocument) {
  return new Range(document.positionAt(start), document.positionAt(end));
}

export function getText(start: number, end: number, document: TextDocument) {
  const documentText = document.getText();
  const subStrResult = documentText.substring(start, end);
  return subStrResult;
}

export function convertRange(range: HtmlRange): Range {
  const start = range.start;
  const end = range.end;
  return new Range(new Position(start.line, start.character), new Position(end.line, end.character));
}

export function normalizeAttributeName(attr: string): string;
export function normalizeAttributeName(attr: null | undefined): undefined;
export function normalizeAttributeName(attr: string | null | undefined): string | undefined;
export function normalizeAttributeName(attr: string | null | undefined): string | undefined {
  return attr?.slice(1, -1);
}

export function getAttrValueForTag(
    node: Node,
    tagName: string,
    attrName: string,
    document?: TextDocument,
    atPosition?: Position): string | undefined {
  if (node.tag == tagName && hasAttr(node, attrName, document, atPosition)) {
    return normalizeAttributeName(node.attributes[attrName]);
  }
}

export function getAttrValueAsInt(node: Node, attrName: string): number | undefined {
  if (hasAttr(node, attrName)) {
    const value = normalizeAttributeName(node.attributes[attrName]);
    return value === '' ? undefined : parseInt(value);
  }
}
type OffsetRange = {startOffset: number, endOffset: number};
export function hasAttr<T extends string>(
    node: Node,
    name: T,
    document?: TextDocument,
    atPosition?: Position): node is Node & { attributes: Record<T, string> } {
  if (!node.attributes) return false;
  if (!(name in node.attributes)) return false;
  if (document && atPosition) {
    return isInAttrValue(node, document, name, atPosition);
  }
  return true;
}

export function isInAttrValue(node: Node, document: TextDocument, attrName: string, position: Position): boolean {
  const text = getText(node.start, node.startTagEnd ?? node.end, document);
  const nameRange = attrNameRange(node, document, position);
  if (!nameRange) return false;
  const attrStart = nameRange.startOffset - node.start;
  const attrEnd = nameRange.endOffset - node.start;

  const foundAttrName = text.substring(attrStart, attrEnd);
  return foundAttrName === attrName;
}

export function attrNameRange(node: Node, document: TextDocument, position: Position): OffsetRange | undefined {
  const text = getText(node.start, node.startTagEnd ?? node.end, document);
  const positionOffset = document.offsetAt(position);

  if (positionOffset < node.start || (node.startTagEnd ?? node.end) < positionOffset) return;
  const cursorOffsetInText = positionOffset - node.start;

  let attrEnd: number | undefined;
  let attrStart: number | undefined;
  for (let i = cursorOffsetInText; i > 0; i--) {
    if (attrEnd === undefined) {
      if (text.charAt(i) != '"') continue;
      i--;
      if (text.charAt(i) != '=') continue;
      attrEnd = i;
    }
    // we've found =" keep going to get the attribute name
    if (text.charAt(i) == ' ') {
      attrStart = i + 1;
      break;
    }
  }
  if (attrEnd === undefined || attrStart === undefined) return;
  return {startOffset: node.start + attrStart, endOffset: node.start + attrEnd};
}

export function firstWhere<T, R>(list: T[], map: (value: T) => R) {
  for (const value of list) {
    const mapped = map(value);
    if (mapped) return mapped;
  }
}

export function addToKey<T, Key>(map: Map<Key, T[]>, key: Key, value: T | T[]) {
  let arr = map.get(key);

  if (value instanceof Array) {
    if (!arr) {
      map.set(key, [...value]);
      return;
    }
    arr.push(...value);
    return;
  }

  const shouldSet = arr === undefined;
  arr ??= [];
  arr.push(value);
  if (shouldSet) map.set(key, arr);
}

export function getFileName(uri: Uri | TextDocument | string): string {
  if (typeof uri === 'object' && 'uri' in uri) uri = uri.uri;
  if (typeof uri !== 'string') uri = uri.path;
  return uri.substr(uri.lastIndexOf('/') + 1);
}
