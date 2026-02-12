const fs = require('fs');
const path = require('path');

const SVG_DIR = path.join(__dirname, '..', '..', 'svg');
const OUTPUT_DIR = path.join(__dirname, '..', 'src', 'icons');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Reserved words that conflict with React imports or JavaScript keywords
const RESERVED_NAMES = new Set([
  'React',
  'Component',
  'Fragment',
  'Children',
  'Element',
  'Node',
  'Event',
  'Error',
  'Function',
  'Object',
  'Array',
  'String',
  'Number',
  'Boolean',
  'Symbol',
  'Map',
  'Set',
  'Promise',
  'Proxy',
  'Reflect',
  'Date',
  'RegExp',
  'JSON',
  'Math',
  'Intl',
  'NaN',
  'Infinity',
  'undefined',
  'null',
  'true',
  'false',
]);

/**
 * Convert kebab-case filename to PascalCase component name
 * e.g., "bx-alarm-clock" -> "AlarmClock"
 */
function toPascalCase(filename) {
  // Remove "bx-" prefix and .svg extension
  const name = filename.replace(/^bx-/, '').replace(/\.svg$/, '');
  
  // Handle names starting with numbers
  let result = name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
  
  // If starts with a number, prefix with "Icon"
  if (/^\d/.test(result)) {
    result = 'Icon' + result;
  }
  
  // If conflicts with reserved names, suffix with "Icon"
  if (RESERVED_NAMES.has(result)) {
    result = result + 'Icon';
  }
  
  return result;
}

/**
 * Parse SVG content and extract the inner paths/content
 */
function parseSvg(svgContent) {
  // Extract viewBox if present
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
  
  // Extract inner content (everything between <svg> tags)
  const innerMatch = svgContent.match(/<svg[^>]*>([\s\S]*)<\/svg>/);
  const innerContent = innerMatch ? innerMatch[1].trim() : '';
  
  return { viewBox, innerContent };
}

/**
 * Escape backticks and ${} in SVG content for template literals
 */
function escapeForTemplate(str) {
  return str.replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

/**
 * Read all SVG files from a pack directory
 */
function readPackSvgs(packName) {
  const packDir = path.join(SVG_DIR, packName);
  if (!fs.existsSync(packDir)) {
    return new Map();
  }
  
  const files = fs.readdirSync(packDir).filter(f => f.endsWith('.svg'));
  const svgs = new Map();
  
  for (const file of files) {
    const content = fs.readFileSync(path.join(packDir, file), 'utf8');
    const componentName = toPascalCase(file);
    svgs.set(componentName, { filename: file, content });
  }
  
  return svgs;
}

/**
 * Generate a React component for an icon
 */
function generateComponent(componentName, packs, defaultPack) {
  const packSvgs = {};
  
  for (const pack of packs) {
    const packDir = path.join(SVG_DIR, pack);
    const files = fs.readdirSync(packDir).filter(f => f.endsWith('.svg'));
    
    for (const file of files) {
      if (toPascalCase(file) === componentName) {
        const content = fs.readFileSync(path.join(packDir, file), 'utf8');
        const { viewBox, innerContent } = parseSvg(content);
        packSvgs[pack] = { viewBox, innerContent: escapeForTemplate(innerContent) };
        break;
      }
    }
  }
  
  if (Object.keys(packSvgs).length === 0) {
    return null;
  }
  
  // Generate the paths object
  const pathsEntries = Object.entries(packSvgs)
    .map(([pack, { viewBox, innerContent }]) => {
      return `  ${pack}: { viewBox: '${viewBox}', content: \`${innerContent}\` }`;
    })
    .join(',\n');
  
  const component = `import React, { forwardRef } from 'react';
import type { BoxIconProps } from '../types.js';
import { buildTransform, getSizePixels } from '../utils.js';

const paths: Record<string, { viewBox: string; content: string }> = {
${pathsEntries}
};

const ${componentName} = forwardRef<SVGSVGElement, BoxIconProps>(
  (
    {
      pack = '${defaultPack}',
      fill = 'currentColor',
      opacity,
      width,
      height,
      size = 'base',
      flip,
      rotate,
      removePadding,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const iconData = paths[pack] || paths['${defaultPack}'];
    const transform = buildTransform(flip, rotate);
    
    // Calculate transform-origin for proper rotation/flip
    const transformOrigin = transform ? 'center' : undefined;
    
    // Use explicit width/height if provided, otherwise use size preset
    const resolvedWidth = width ?? getSizePixels(size);
    const resolvedHeight = height ?? getSizePixels(size);
    
    // Use cropped viewBox if removePadding is true
    const resolvedViewBox = removePadding ? '2 2 20 20' : iconData.viewBox;
    
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={resolvedViewBox}
        width={resolvedWidth}
        height={resolvedHeight}
        fill={fill}
        opacity={opacity}
        className={className}
        style={{ ...style, transformOrigin }}
        transform={transform}
        {...props}
        dangerouslySetInnerHTML={{ __html: iconData.content }}
      />
    );
  }
);

${componentName}.displayName = '${componentName}';

export { ${componentName} };
export default ${componentName};
`;

  return component;
}

/**
 * Main generation function
 */
function generate() {
  console.log('🎨 Generating Boxicons React components...\n');
  
  // Read all SVGs from each pack
  const basicSvgs = readPackSvgs('basic');
  const filledSvgs = readPackSvgs('filled');
  const brandsSvgs = readPackSvgs('brands');
  
  console.log(`📦 Found ${basicSvgs.size} basic icons`);
  console.log(`📦 Found ${filledSvgs.size} filled icons`);
  console.log(`📦 Found ${brandsSvgs.size} brand icons`);
  
  // Collect all unique component names and their available packs
  const iconConfigs = new Map();
  
  // Basic icons (can also have filled variants)
  for (const name of basicSvgs.keys()) {
    const packs = ['basic'];
    if (filledSvgs.has(name)) {
      packs.push('filled');
    }
    iconConfigs.set(name, { packs, defaultPack: 'basic', isBrandOnly: false });
  }
  
  // Filled icons that might not be in basic
  for (const name of filledSvgs.keys()) {
    if (!iconConfigs.has(name)) {
      iconConfigs.set(name, { packs: ['filled'], defaultPack: 'filled', isBrandOnly: false });
    }
  }
  
  // Brand icons (brands only)
  for (const name of brandsSvgs.keys()) {
    if (!iconConfigs.has(name)) {
      iconConfigs.set(name, { packs: ['brands'], defaultPack: 'brands', isBrandOnly: true });
    } else {
      // Add brands to existing icon packs
      const config = iconConfigs.get(name);
      config.packs.push('brands');
    }
  }
  
  console.log(`\n📝 Generating ${iconConfigs.size} unique icon components...\n`);
  
  // Generate each component
  const exports = [];
  let generated = 0;
  
  for (const [name, config] of iconConfigs) {
    const component = generateComponent(name, config.packs, config.defaultPack);
    
    if (component) {
      const outputPath = path.join(OUTPUT_DIR, `${name}.tsx`);
      fs.writeFileSync(outputPath, component);
      exports.push(name);
      generated++;
      
      if (generated % 100 === 0) {
        console.log(`   Generated ${generated} components...`);
      }
    }
  }
  
  console.log(`   Generated ${generated} components total.\n`);
  
  // Generate barrel export file for icons
  const iconsIndexContent = exports
    .sort()
    .map(name => `export { ${name} } from './${name}.js';`)
    .join('\n');
  
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'index.ts'),
    iconsIndexContent + '\n'
  );
  
  console.log('✅ Generated icons/index.ts with all exports');
  
  // Generate main index.ts
  const mainIndexContent = `// Re-export all icons
export * from './icons/index.js';

// Export types
export type { BoxIconProps, IconPack, FlipDirection, IconSize, IconConfig } from './types.js';

// Export utilities
export { buildTransform, getSizePixels } from './utils.js';
`;
  
  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'index.ts'),
    mainIndexContent
  );
  
  console.log('✅ Generated src/index.ts\n');
  console.log(`🎉 Successfully generated ${generated} icon components!`);
}

generate();
