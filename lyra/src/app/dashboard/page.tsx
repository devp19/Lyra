"use client";
import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { MonacoEditorClient } from "@/components/MonacoEditorClient";
import { IoIosClose } from "react-icons/io";
import React from "react";

const filesData: Record<string, string> = {
  "components/ui/button.tsx": `// Button component\nexport function Button() { return <button>Click</button>; }`,
  "components/ui/card.tsx": `// Card component\nexport function Card() { return <div>Card</div>; }`,
  "App.jsx": `import './App.css';\nimport { useState } from 'react';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  return (\n    <div>\n      <h1>React Starter Code</h1>\n      <h2>Hello</h2>\n      <p>\n        Edit App.jsx to <b>get</b> started.\n      </p>\n      <button onClick={() => setCount(count => count + 1)}>\n        Clicked {count} times\n      </button>\n    </div>\n  );\n}\n\nexport default App;\n`,
  "App.css": `body {background: #171717; color: white;}`,
};

export default function Page() {
  const [openedFiles, setOpenedFiles] = useState<string[]>([
    "components/ui/button.tsx",
  ]);
  const [activeFile, setActiveFile] = useState<string>("components/ui/button.tsx");

  const openFile = (filePath: string) => {
    setOpenedFiles((files) =>
      files.includes(filePath) ? files : [...files, filePath]
    );
    setActiveFile(filePath);
  };

  const closeFile = (filePath: string) => {
    setOpenedFiles((files) => files.filter((f) => f !== filePath));
    if (activeFile === filePath) {
      setActiveFile(
        openedFiles.filter((f) => f !== filePath).slice(-1)[0] ?? ""
      );
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar openFile={openFile} activeFile={activeFile} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
  <BreadcrumbList>
    {activeFile &&
      activeFile.split("/").map((segment, idx, arr) => (
        <React.Fragment key={idx}>
          <BreadcrumbItem className={idx === arr.length - 1 ? undefined : "hidden md:block"}>
            {idx === arr.length - 1 ? (
              <BreadcrumbPage>{segment}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink href="#">{segment}</BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {idx < arr.length - 1 && (
            <BreadcrumbSeparator className="hidden md:block" />
          )}
        </React.Fragment>
      ))}
  </BreadcrumbList>
</Breadcrumb>

        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 h-full">
            {/* Editor/tabs area */}
            <div
              className="col-span-2 min-h-[60vh] md:min-h-[calc(100vh-6rem)] flex flex-col"
              style={{ borderRadius: "10px" }}
            >
              {/* Tabs Row */}
              <div className="flex items-center h-10 overflow-x-auto gap-1 mb-2">
                {openedFiles.map((file) => (
                  <div
                    key={file}
                    onClick={() => setActiveFile(file)}
                    className={`flex items-center px-3 py-2 cursor-pointer rounded-sm text-sm
                      ${
                        file === activeFile
                          ? "bg-zinc-900 text-white"
                          : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"
                      }
                    `}
                    style={{
                      fontWeight: file === activeFile ? 400 : 400,
                    }}
                  >
                    <span>{file.split("/").pop()}</span>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        closeFile(file);
                      }}
                      className="ml-2 px-1.5 text-white-500 hover:text-white"
                      aria-label="Close file"
                    >
                      <IoIosClose size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex-1 min-h-0 overflow-hidden" style={{ borderRadius: "10px", border: "1px solid #2a2a2a" }}>
                {activeFile && (
                  <MonacoEditorClient
                    value={filesData[activeFile] ?? ""}
                    language={
                      activeFile.endsWith(".tsx") ? "typescript"
                      : activeFile.endsWith(".jsx") ? "javascript"
                      : activeFile.endsWith(".css") ? "css"
                      : "plaintext"
                    }
                    key={activeFile}
                  />
                )}
              </div>
            </div>
            {/* KEEP THIS SIDE BLANK FOR NOW AI CHAT I WILL INTEGRATE HERE AS A NEW VERT COL!!*/}
            <div />
          </div>
        </div>
        {/* testing file open cllse will remove after*/}
        <div className="flex gap-3 mt-2 text-xs text-zinc-500 px-4">
          <span>Quick open file:</span>
          <button
            className="underline hover:text-indigo-400"
            onClick={() => openFile("components/ui/card.tsx")}
          >
            card.tsx
          </button>
          <button
            className="underline hover:text-indigo-400"
            onClick={() => openFile("App.jsx")}
          >
            App.jsx
          </button>
          <button
            className="underline hover:text-indigo-400"
            onClick={() => openFile("App.css")}
          >
            App.css
          </button>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
