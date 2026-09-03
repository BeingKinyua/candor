import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'node_modules/next/dist/bin/next');
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  // Strip any existing alias
  content = content.replaceAll(".option('--host <hostname>', 'Alias for hostname')", '');
  // Re-insert single alias before every -H, --hostname
  content = content.replaceAll(
    ".option('-H, --hostname <hostname>'",
    ".option('--host <hostname>', 'Alias for hostname').option('-H, --hostname <hostname>'"
  );
  if (!content.includes('options.hostname = options.hostname || options.host')) {
    content = content.replace(
      'options.hostname = options.hostname',
      'options.hostname = options.hostname || options.host'
    );
  }
  fs.writeFileSync(file, content);
  console.log('[patch-next] Next binary successfully patched for --host flag compatibility across dev and start commands.');
}
