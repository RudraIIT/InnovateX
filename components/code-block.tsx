import React from "react";

import { CodeBlock } from "@/components/ui/code-block";

export function CodeBlockFun() {
  const ReactComponent = `import React from "react";

const GradientText: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f0f17] text-white">
      <h1 className="text-5xl md:text-6xl font-bold text-center">
        Create{" "}
        <span className="bg-gradient-to-r from-[#44d7b6] via-[#7396ff] to-[#8b5cf6] bg-clip-text text-transparent">
          your own
        </span>{" "}
        ChatGPT
      </h1>
      <p className="text-neutral-400 mt-2 text-lg">Create. Customize. Integrate.</p>
    </div>
  );
};

export default GradientText;
`;

  const APIcomponent = `import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({
    success: true,
    message: "Welcome to the InnovateX!",
    data: {
      name: "Website Builder Pro",
      description: "A powerful platform to create and deploy websites instantly.",
      features: [
        "No-code website builder",
        "AI-generated content",
        "SEO optimization",
        "Instant deployment",
      ],
    },
  });
}
`;

  return (
    <div className="max-w-4xl mx-auto w-full">
      <CodeBlock
        language="jsx"
        filename="DummyComponent.jsx"
        tabs={[
          { name: "app/component.tsx", code: ReactComponent, language: "typescript" },
          {
            name: "app/api/info.ts",
            code: APIcomponent,
            language: "typescript",
            highlightLines: [1, 2, 3],
          },
        ]}
      />
    </div>
  );
}