import * as React from "react";
import { ChevronRight, File, Folder, Plus } from "lucide-react";

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
  // Make sidebar tree stateful to allow dynamic file creation
  const [tree, setTree] = React.useState(initialData.tree);
  const [isCreating, setIsCreating] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Focus input after showing it
  React.useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating]);

  // Function to insert a file into the root of the file tree
  const handleCreateFile = () => {
    const name = newFileName.trim();
    if (!name) {
      setIsCreating(false);
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
      setIsCreating(false);
      setNewFileName("");
      return;
    }
    setTree((prev) => [...prev, name]);
    setIsCreating(false);
    setNewFileName("");
    openFile(name); // Immediately open file after creation (optional)
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
            <button
              type="button"
              onClick={() => setIsCreating(true)}
              className="ml-2 rounded p-1 hover:bg-muted transition-colors"
              aria-label="Create New File"
              tabIndex={0}
            >
              <Plus size={16} />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* New File Input, inline, root only */}
              {isCreating && (
                <SidebarMenuButton className="flex gap-2">
                  <File />
                  <input
                    ref={inputRef}
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    onBlur={handleCreateFile}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleCreateFile();
                      if (e.key === "Escape") {
                        setIsCreating(false);
                        setNewFileName("");
                      }
                    }}
                    className="bg-transparent border-b border-muted outline-none text-inherit px-1"
                    placeholder="e.g. newfile.ts"
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
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const path = parentPath ? `${parentPath}/${name}` : name;

  if (!items.length) {
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
