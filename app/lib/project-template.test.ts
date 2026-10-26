import { readFile } from 'node:fs/promises'
import path from 'node:path'
// @mdx-js/mdx is the compiler @next/mdx runs (through @mdx-js/loader), so this matches the build.
import { compile } from '@mdx-js/mdx'
import remarkGfm from 'remark-gfm'
import { describe, expect, it } from 'vitest'

describe('docs/project-template.mdx', () => {
  it('compiles, so a project copied from it builds', async () => {
    const source = await readFile(path.join(process.cwd(), 'docs/project-template.mdx'), 'utf8')
    await expect(compile(source, { remarkPlugins: [remarkGfm] })).resolves.toBeDefined()
  })
})
