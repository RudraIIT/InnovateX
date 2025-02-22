export const DATABASE_CONNECTION_PROMPT = `
Ensure to generate a file that manages the connection to the database, named 'db.ts', with the following requirements:

- The file should be located in the 'src/utils/' directory.
- It should export a function to connect to the database.
- Use appropriate database connection library Prisma.
- Ensure proper error handling and connection pooling if necessary.
`;

export const formatPrompt = (prompt: string) => {
  return `
  All the files which are required to build this application should be mentioned in the specific format.
  where it should be under file tag, name tag should contain the name of the file, path tag should contain the path of the file and content tag should contain the content of the file.
  for example,
  <CodeParserFile>
    <CodeParserName>{file name}</CodeParserName>
    <CodeParserPath>{file path}</CodeParserPath>
    <CodeParserContent>
      {code in the file}
    </CodeParserContent>
  </CodeParserFile>
  for example if a file named example.js is in the root directory, then it should be mentioned as
  <CodeParserFile>
    <CodeParserName>example.js</CodeParserName>
    <CodeParserPath>example.js</CodeParserPath>
    <CodeParserContent>
      console.log('Hello World');
    </CodeParserContent>
  </CodeParserFile>
  for example if a file named example.js is in the src directory, then it should be mentioned as
  <CodeParserFile>
    <CodeParserName>example.js</CodeParserName>
    <CodeParserPath>src/example.js</CodeParserPath>
    <CodeParserContent>
      console.log('Hello World');
    </CodeParserContent>
  </CodeParserFile>

  you should provide the entire code for all the files required to build this application.

  after that you should provide your generel text information about the application in the specific format, like inside response tag.
  for example,
  <CodeParserResponse>
    This is a web application which is built using HTML, CSS and JavaScript.
    It is a simple web application which displays a welcome message.
  </CodeParserResponse>

  Also, mention the title according to you of this application in title tag, like 
  <CodeParserTitle>My Web Application</CodeParserTitle>

  Consider following things to avoid errors in application:
    1. The files should be mentioned in the specific format.
    2. Make sure you provide the files, which you have imported in other files.
    3. Make sure to use characters directtly, instead of using there codes, 
      for example,
        use single quotes instead of using &#39;.
        use < instead of using &lt;.
        use > instead of using &gt;.
        and etc.

  ${prompt}
  `
}

const GENERAL_PROMPT = `
Below is the description of a website that I want to build.

- The website should be a **full-stack Next.js 15.1.6 project** using the App Router and JavaScript.
- UI/UX should be **modern, elegant, and responsive** across all devices.
- Use **Tailwind CSS** for styling.
- Include **Dark Mode Support** using Tailwind's dark mode feature.
- Avoid unnecessary animations but ensure a smooth, polished UI.
- Implement authentication if applicable (e.g., NextAuth.js).
- Follow the **best practices of Next.js 15.1.6 App Router**.
- The project should be structured properly, with separate concerns for **components, API routes, and utilities**.

The website should have **as many relevant features as possible** to make it a complete, functional project.

Write both **frontend and backend code** within Next.js.
`;


const ERROR_AVOIDANCE_PROMPT = `
Strictly follow these Next.js best practices to avoid errors:

✅ **Client vs Server**
- Use **"use client"** in every React component that contains hooks ('useState', 'useEffect', 'useContext').
- Keep **API routes, database connections, and sensitive operations in "use server"**.

✅ **File Structure (Follow Exactly)**
- The 'src/app/' directory should **ONLY contain API routes, layout, and pages**.
- **Do not create extra folders inside** 'src/app/'. Other files should go in 'src/'.

✅ **Important Required Files**
Ensure these files exist to prevent compilation errors:
- 'src/app/layout.jsx'
- 'src/app/globals.css'
- '/tailwind.config.js'
- '/package.json'

✅ **API Routes**
- API functions should **always** use **named exports** instead of 'export default' to avoid conflicts.

✅ **Correct Import/Export Usage**
- Every import should be correct, and every function/component should be exported properly.

🚨 **Do NOT generate any additional folders or files beyond the specified structure.**
🚨 **Strictly ensure every file is at its correct location.**
`;


export const STEP_GENERATION_PROMPT = (prompt: string) => `
${GENERAL_PROMPT}

${DATABASE_CONNECTION_PROMPT}

Now, to build the website described below:

"${prompt}"

🔹 Provide **detailed step-by-step instructions** to achieve this.
🔹 Break down the steps into clear, **actionable tasks** (Frontend, Backend, Database, etc.).
🔹 Mention key **libraries/tools** needed (e.g., Tailwind, NextAuth, Prisma, WebSockets).
🔹 Keep explanations concise but precise.
🔹 Your Respons first line should include the **title** for this website.
    Example: "Title: Build a Social Media Platform"

Your response should be in **clear numbered steps**.
`;

export const CODE_GENERATION_PROMPT = (prompt: string, steps: string) => `
${GENERAL_PROMPT}

To implement the website as described below:
"${prompt}"

Follow these steps to generate the required code:
"${steps}"

📂 **Folder Structure (Strictly Follow This)**
- prisma/
  - schema.prisma
- public/ (if needed)
- src/
  - app/
    - api/ (ALL API routes must be inside this)
    - globals.css
    - layout.jsx
    - page.jsx
  - components/ (ALL UI components go here)
  - utils/ (Helper functions)
- .env
- package.json
- tailwind.config.js

🚨 **Important Directives:**
- **DO NOT** include extra folders inside 'src/app/' except 'api/', 'layout.jsx', and 'page.jsx'.
- **DO NOT** generate unnecessary files.
- Code should be **properly formatted** and in **JavaScript (no TypeScript)**.

${ERROR_AVOIDANCE_PROMPT}
`;


export const CODE_MODIFICATION_PROMPT = (prompt: string, code: string) => `
${GENERAL_PROMPT}

🔹 Below is the current code:
\`\`\`js
${code}
\`\`\`

🔹 Modify the code based on the following requirements:
"${prompt}"

🚨 **Guidelines for Modification:**
- **Only return the modified files.** Do NOT remove or alter unrelated files.
- **Preserve the original structure** and **do not introduce breaking changes**.
- **Ensure all necessary imports/exports are correctly updated.**

${ERROR_AVOIDANCE_PROMPT}
`;