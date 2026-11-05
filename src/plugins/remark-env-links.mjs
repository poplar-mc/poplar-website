import { visit } from 'unist-util-visit';

// Markdown cannot read env vars, so pages write `%PUBLIC_NAME%` in links and code, and this fills in the value.
export function remarkEnvLinks(env) {
  const fill = (text) =>
    text.replace(/%(PUBLIC_[A-Z0-9_]+)%/g, (_, name) => {
      if (!env[name]) throw new Error(`${name} is not set in website/.env. Copy it from website/.env.example`);
      return env[name];
    });

  return () => (tree) => {
    visit(tree, (node) => {
      if (node.type === 'link') node.url = fill(node.url);
      if (node.type === 'code' || node.type === 'inlineCode') node.value = fill(node.value);
    });
  };
}
