// Diagnostyka Contentful space — content types + counts.
import fs from 'node:fs';
import { createClient } from 'contentful';

const env = Object.fromEntries(
  fs.readFileSync('.env', 'utf8').split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const cf = createClient({
  space: env.CONTENTFUL_SPACE_ID,
  accessToken: env.CONTENTFUL_ACCESS_TOKEN,
  environment: env.CONTENTFUL_ENVIRONMENT || 'master',
});

console.log('== Content types ==');
const types = await cf.getContentTypes();
for (const t of types.items) {
  console.log(`  ${t.sys.id.padEnd(20)} (${t.name})`);
  console.log('    fields:', t.fields.map(f => `${f.id}:${f.type}${f.linkType ? '<'+f.linkType+'>' : ''}`).join(', '));
}

console.log('\n== Entry counts ==');
for (const t of types.items) {
  const r = await cf.getEntries({ content_type: t.sys.id, limit: 0 });
  console.log(`  ${t.sys.id.padEnd(20)} ${r.total} entries`);
}
