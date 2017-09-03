const markdown = require('remark-parse');
const unified = require('unified');
const breaks = require('remark-breaks');
const emoji = require('remark-emoji');
const disable = require('remark-disable-tokenizers');

export function mdParse(text: string): Root {
  return unified()
    .use(markdown)
    .use(disable, {
      block: [
        'html',
        'footnote'
      ],
      inline: [
      ]
    })
    .use(breaks)
    .use(emoji)
    .parse(text);
}

export type MdNode = Paragraph |
  Blockquote |
  Heading |
  Code |
  InlineCode |
  List |
  ListItem |
  Table |
  TableRow |
  TableCell |
  ThematicBreak |
  Break |
  Emphasis |
  Strong |
  Delete |
  Link |
  Image |
  Text;

interface IParent {
  children: MdNode[];
}

interface IText {
  value: string;
}

export interface Root extends IParent {
  type: 'root';
}

interface Paragraph extends IParent {
  type: "paragraph";
}

interface Blockquote extends IParent {
  type: "blockquote";
}

interface Heading extends IParent {
  type: "heading";
  depth: 1 | 2 | 3 | 4 | 5 | 6;
}

interface Code extends IText {
  type: "code";
  lang: string | null;
}

interface InlineCode extends IText {
  type: "inlineCode";
}

interface List extends IParent {
  type: "list";
  ordered: boolean;
  start: number | null;
  loose: boolean;
}

interface ListItem extends IParent {
  type: "listItem";
  loose: boolean;
  checked: boolean | null;
}

interface Table extends IParent {
  type: "table";
  align: ("left" | "right" | "center" | null)[];
}

interface TableRow extends IParent {
  type: "tableRow";
}

interface TableCell extends IParent {
  type: "tableCell";
}

interface ThematicBreak {
  type: "thematicBreak";
}

interface Break {
  type: "break";
}

interface Emphasis extends IParent {
  type: "emphasis";
}

interface Strong extends IParent {
  type: "strong";
}

interface Delete extends IParent {
  type: "delete";
}

interface Link extends IParent {
  type: "link";
  title: string | null;
  url: string;
}

interface Image {
  type: "image";
  title: string | null;
  alt: string | null;
  url: string;
}

interface Text extends IText {
  type: "text";
}