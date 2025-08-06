"use client";

import Editor from "@monaco-editor/react";
import type * as monacoType from "monaco-editor";


export function MonacoEditorClient({
  value = "",
  language = "typescript",
  onChange,
}: {
  value?: string;
  language?: string;
  onChange?: (value: string | undefined) => void;
}) {
  const handleBeforeMount = (monaco: typeof monacoType) => {
    monaco.editor.defineTheme("custom-theme", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#171717", 
        "editor.foreground": "#ffffff",
      },
    });
  };

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      theme="custom-theme" 
      defaultValue={value}
      onChange={onChange}
      beforeMount={handleBeforeMount}
      options={{
        fontSize: 12,
        fontFamily: "Inter, monospace",
        minimap: { enabled: true },
        padding: {
          top: 20,
          bottom: 10,
        },
      }}
    />
  );
}
