import * as React from "react";
import { ChevronRight, File, Folder, Plus, FolderPlus } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarRail,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";

// Initial sample data
const initialData = {
  changes: [
    { file: "README.md", state: "M" },
    { file: "api/hello/route.ts", state: "U" },
    { file: "app/layout.tsx", state: "M" },
  ],
  tree: [
    [
      "app",
      [
        "api",
        ["hello", ["route.ts"]],
        "page.tsx",
        "layout.tsx",
        ["blog", ["page.tsx"]],
      ],
    ],
    [
      "components",
      ["ui", "button.tsx", "card.tsx"],
      "header.tsx",
      "footer.tsx",
    ],
    ["lib", ["util.ts"]],
    ["public", "favicon.ico", "vercel.svg"],
    ".eslintrc.json",
    ".gitignore",
    "next.config.js",
    "tailwind.config.js",
    "package.json",
    "README.md",
  ],
};

export function AppSidebar({
  openFile,
  activeFile,
  ...props
}: {
  openFile: (filePath: string) => void;
  activeFile: string;
} & React.ComponentProps<typeof Sidebar>) {
  // Make sidebar tree stateful to allow dynamic file and folder creation
  const [tree, setTree] = React.useState(initialData.tree);
  const [isCreatingFile, setIsCreatingFile] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState("");
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const folderInputRef = React.useRef<HTMLInputElement>(null);

  // Focus input after showing it for file
  React.useEffect(() => {
    if (isCreatingFile && fileInputRef.current) {
      fileInputRef.current.focus();
    }
  }, [isCreatingFile]);

  // Focus input after showing it for folder
  React.useEffect(() => {
    if (isCreatingFolder && folderInputRef.current) {
      folderInputRef.current.focus();
    }
  }, [isCreatingFolder]);

  // Function to insert a file into the root of the file tree
  const handleCreateFile = () => {
    const name = newFileName.trim();
    if (!name) {
      setIsCreatingFile(false);
      setNewFileName("");
      return;
    }
    if (
      tree.some((item) =>
        typeof item === "string"
          ? item === name
          : Array.isArray(item) && item[0] === name
      )
    ) {
      setIsCreatingFile(false);
      setNewFileName("");
      return;
    }
    setTree((prev) => [...prev, name]);
    setIsCreatingFile(false);
    setNewFileName("");
    openFile(name); // Immediately open file after creation (optional)
  };

  // Function to insert a folder into the root of the file tree
  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) {
      setIsCreatingFolder(false);
      setNewFolderName("");
      return;
    }
    if (
      tree.some((item) =>
        typeof item === "string"
          ? item === name
          : Array.isArray(item) && item[0] === name
      )
    ) {
      setIsCreatingFolder(false);
      setNewFolderName("");
      return;
    }
    setTree((prev) => [...prev, [name]]);
    setIsCreatingFolder(false);
    setNewFolderName("");
    // Optionally, you could expand the new folder or navigate to it
  };

  return (
    <Sidebar {...props}>
      <img
        src="lyra-transparent.png"
        height={62}
        width={62}
        className="ml-3"
        alt="Logo"
      />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Changes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {initialData.changes.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton>
                    <File />
                    {item.file}
                  </SidebarMenuButton>
                  <SidebarMenuBadge>{item.state}</SidebarMenuBadge>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between">
            <span>Files</span>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setIsCreatingFile(true)}
                className="mr-2 rounded p-1 hover:bg-muted transition-colors"
                aria-label="Create New File"
                tabIndex={0}
              >
                <Plus size={16} />
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingFolder(true)}
                className="rounded p-1 hover:bg-muted transition-colors"
                aria-label="Create New Folder"
                tabIndex={0}
              >
                <FolderPlus size={16} />
              </button>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* New File Input, inline, root only */}
              {isCreatingFile && (
                <SidebarMenuButton className="flex gap-2">
                  <File />
                  <input
                    ref={fileInputRef}
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onBlur={handleCreateFile}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFile();
                      if (e.key === "Escape") {
                        setIsCreatingFile(false);
                        setNewFileName("");
                      }
                    }}
                    className="bg-transparent border-b border-muted outline-none text-inherit px-1"
                    placeholder="e.g. newfile.ts"
                    style={{ minWidth: "120px" }}
                  />
                </SidebarMenuButton>
              )}
              {/* New Folder Input, inline, root only */}
              {isCreatingFolder && (
                <SidebarMenuButton className="flex gap-2">
                  <Folder />
                  <input
                    ref={folderInputRef}
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    onBlur={handleCreateFolder}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFolder();
                      if (e.key === "Escape") {
                        setIsCreatingFolder(false);
                        setNewFolderName("");
                      }
                    }}
                    className="bg-transparent border-b border-muted outline-none text-inherit px-1"
                    placeholder="e.g. newfolder"
                    style={{ minWidth: "120px" }}
                  />
                </SidebarMenuButton>
              )}
              {/* The File Tree */}
              {tree.map((item, index) => (
                <Tree
                  key={index}
                  item={item}
                  openFile={openFile}
                  activeFile={activeFile}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

// Recursive File/Folder Tree renderer
function Tree({
  item,
  openFile,
  activeFile,
  parentPath = "",
}: {
  item: string | any[];
  openFile: (filePath: string) => void;
  activeFile: string;
  parentPath?: string;
}) {
  const isFile = typeof item === "string";
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const path = parentPath ? `${parentPath}/${name}` : name;

  if (isFile) {
    return (
      <SidebarMenuButton
        isActive={path === activeFile}
        onClick={() => openFile(path)}
        className="data-[active=true]:bg-transparent"
      >
        <File />
        {name}
      </SidebarMenuButton>
    );
  }

  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen={name === "components" || name === "ui"}
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRight className="transition-transform" />
            <Folder />
            {name}
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subItem, index) => (
              <Tree
                key={index}
                item={subItem}
                openFile={openFile}
                activeFile={activeFile}
                parentPath={path}
              />
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
}
