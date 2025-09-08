#!/usr/bin/env node
// Append a release note to public/updates.json
// Usage: node scripts/append-update.js "title" "content" "feature|fix|improvement|announcement"

const fs = require('fs')
const path = require('path')

const [,, title, content, type = 'improvement'] = process.argv
if (!title || !content) {
  console.error('Usage: node scripts/append-update.js "title" "content" "type"')
  process.exit(1)
}

const file = path.resolve(__dirname, '..', 'public', 'updates.json')
let list = []
try {
  const raw = fs.readFileSync(file, 'utf8')
  list = JSON.parse(raw)
  if (!Array.isArray(list)) list = []
} catch {
  list = []
}

const today = new Date()
const date = today.toISOString().slice(0,10)
const id = `${date}-${Math.random().toString(36).slice(2,8)}`

list.unshift({ id, date, title, content, type })

fs.writeFileSync(file, JSON.stringify(list, null, 2) + '\n', 'utf8')
console.log('Appended update:', { id, date, title, type })


