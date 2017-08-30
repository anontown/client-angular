const markdown = require('remark-parse');
const unified = require('unified');
const breaks = require('remark-breaks');
const emoji = require('remark-emoji');

function MdParse(text: string): Root {
  return unified()
    .use(markdown)
    .use(breaks)
    .use(emoji)
    .parse(text);
}

type MdNode = Paragraph |
  Blockquote |
  Heading |
  Code |
  InlineCode |
  HTML |
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

interface Root extends IParent {
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

interface HTML extends IText {
  type: "html";
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