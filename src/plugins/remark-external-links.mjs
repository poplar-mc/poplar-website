import { visit } from 'unist-util-visit';

export function remarkExternalLinks() {
  return (tree) => {
    visit(tree, 'link', (node) => {
      if (!/^https?:/.test(node.url)) return;
      node.data = { ...node.data, hProperties: { ...node.data?.hProperties, target: '_blank' } };
    });
  };
}
