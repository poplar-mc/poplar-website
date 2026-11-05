import { visit } from 'unist-util-visit';

// Wraps a `**Costs and caveats**` paragraph and the list after it in a box, so the Markdown stays plain.
export function remarkCaveats() {
  return (tree) => {
    visit(tree, 'paragraph', (paragraph, index, parent) => {
      const [label] = paragraph.children;
      if (paragraph.children.length !== 1 || label.type !== 'strong' || label.children[0]?.value !== 'Costs and caveats') return;
      const list = parent.children[index + 1];
      if (list?.type !== 'list') return;
      parent.children.splice(index, 2, {
        type: 'caveats',
        data: { hName: 'div', hProperties: { className: ['caveats'] } },
        children: [paragraph, list],
      });
    });
  };
}
