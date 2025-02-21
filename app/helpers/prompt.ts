export const parser = (prompt: string) => {
    return `
### Follow this format strictly. Only return code, no explanations.

<CodeParserFile>
  <CodeParserName>{file name}</CodeParserName>
  <CodeParserPath>{file path}</CodeParserPath>
  <CodeParserContent>
    {file content}
  </CodeParserContent>
</CodeParserFile>

Example:
<CodeParserFile>
  <CodeParserName>index.js</CodeParserName>
  <CodeParserPath>index.js</CodeParserPath>
  <CodeParserContent>
    console.log('Hello');
  </CodeParserContent>
</CodeParserFile>

Include:
- **ALL necessary files** (Frontend + Backend).
- **Complete & functional code** (No placeholders).
- **Only return the formatted code** (No explanations).

${prompt}
`;
}

const GENERAL_PROMPT = `
Build a **full-stack Next.js 15.1.6 app** with the App Router.
- **Tailwind CSS** for styling.
- **Dark Mode support**.
- Minimal animations, modern UI.
- **NextAuth.js** if authentication is needed.
- Follow **Next.js best practices**.

Ensure:
- **Frontend & backend code** is in **JavaScript**.
- No extra folders in \`src/app/\`.
- **Correct imports & dependencies**.
`;

export const CODE_GENERATION_PROMPT = (prompt: string, steps: string) => {
    return `
### Project Overview:
"${prompt}"

### Steps to Implement:
"${steps}"

### Expected Folder Structure:
📂 **Folder Structure**
- prisma/schema.prisma
- public/ (if needed)
- src/
  - app/
    - api/ (ALL API routes)
    - layout.jsx
    - page.jsx
  - components/
  - utils/
- .env
- package.json
- tailwind.config.js

🚨 **Important Rules**
- **ONLY return the final code in the required format**.
- **DO NOT include any explanations**.
- **DO NOT use placeholders like {file content}**.
`;
}