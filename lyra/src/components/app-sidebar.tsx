import * as React from "react";
import {
  ChevronRight, File, Folder, Plus, FolderPlus
} from "lucide-react";
import {
  Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarMenuSub, SidebarRail, SidebarMenuBadge,
} from "@/components/ui/sidebar";
import {
  DndContext, useDraggable, useDroppable, DragEndEvent,
} from "@dnd-kit/core";

type TreeNode = string | [string, ...TreeNode[]]; // file is string, folder is [name, ...children]
type FileTree = TreeNode[];

// Unique path-based id for each node in the tree
function getNodeId(name: string, parentPath: string = ""): string {
  return parentPath ? parentPath + "/" + name : name;
}

// Deep clone tree utility
function deepClone(obj: FileTree): FileTree {
  return JSON.parse(JSON.stringify(obj));
}

// Find and remove an item from the tree, returns [item, newTree]
function removeItem(tree: FileTree, pathArr: string[]): [TreeNode | null, FileTree] {
  if (pathArr.length === 1) {
    const idx = tree.findIndex(item =>
      (typeof item === "string" && item === pathArr[0]) ||
      (Array.isArray(item) && item[0] === pathArr[0])
    );
    if (idx === -1) return [null, tree];
    const [removed] = tree.splice(idx, 1);
    return [removed, tree];
  }
  const [head, ...rest] = pathArr;
  const idx = tree.findIndex(item => Array.isArray(item) && item[0] === head);
  if (idx !== -1 && Array.isArray(tree[idx])) {
    const folderNode = tree[idx] as [string, ...TreeNode[]];
    const [removed, subtree] = removeItem(folderNode.slice(1), rest);
    tree[idx] = [folderNode[0], ...subtree];
    return [removed, tree];
  }
  return [null, tree];
}

// Insert item into tree at folderPath; folderPath is an array of names
function insertItem(tree: FileTree, folderPath: string[], item: TreeNode): FileTree {
  if (folderPath.length === 0) {
    tree.push(item);
    return tree;
  }
  const [head, ...rest] = folderPath;
  const idx = tree.findIndex(i => Array.isArray(i) && i[0] === head);
  if (idx !== -1) {
    const folderNode = tree[idx] as [string, ...TreeNode[]];
    tree[idx] = [folderNode[0], ...insertItem(folderNode.slice(1), rest, item)];
  }
  return tree;
}

// Recursively search if a path points to a folder
function searchNode(arr: FileTree, pathArr: string[]): boolean {
  if (pathArr.length === 0) return false;
  const [head, ...rest] = pathArr;
  const node = arr.find(i =>
    (typeof i === "string" && i === head) ||
    (Array.isArray(i) && i[0] === head)
  );
  if (rest.length === 0)
    return Array.isArray(node);
  if (Array.isArray(node)) return searchNode((node as [string, ...TreeNode[]]).slice(1), rest);
  return false;
}

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
  ] as FileTree,
};

export function AppSidebar({
  openFile,
  activeFile,
  ...props
}: {
  openFile: (filePath: string) => void;
  activeFile: string;
} & React.ComponentProps<typeof Sidebar>) {
  const [tree, setTree] = React.useState<FileTree>(initialData.tree);
  const [isCreatingFile, setIsCreatingFile] = React.useState(false);
  const [newFileName, setNewFileName] = React.useState("");
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false);
  const [newFolderName, setNewFolderName] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const folderInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isCreatingFile && fileInputRef.current) fileInputRef.current.focus();
  }, [isCreatingFile]);
  const handleCreateFile = () => {
    const name = newFileName.trim();
    if (!name) { setIsCreatingFile(false); setNewFileName(""); return; }
    if (
      tree.some(item =>
        typeof item === "string"
          ? item === name
          : Array.isArray(item) && item[0] === name
      )
    ) {
      setIsCreatingFile(false); setNewFileName(""); return;
    }
    setTree(prev => [...prev, name]);
    setIsCreatingFile(false); setNewFileName("");
    openFile(name);
  };

  React.useEffect(() => {
    if (isCreatingFolder && folderInputRef.current) folderInputRef.current.focus();
  }, [isCreatingFolder]);
  const handleCreateFolder = () => {
    const name = newFolderName.trim();
    if (!name) { setIsCreatingFolder(false); setNewFolderName(""); return; }
    if (
      tree.some(item =>
        typeof item === "string"
          ? item === name
          : Array.isArray(item) && item[0] === name
      )
    ) {
      setIsCreatingFolder(false); setNewFolderName(""); return;
    }
    setTree(prev => [...prev, [name]]);
    setIsCreatingFolder(false); setNewFolderName("");
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    // Get paths from ids
    const activePath = (active.id as string).split("/");
    const overPath = (over.id as string).split("/");

    // Drop logic
    let dropFolderPath: string[] = [];
    let isOverFolder = false;
    if (over.id !== "") {
      isOverFolder = searchNode(tree, overPath);
      dropFolderPath = isOverFolder
        ? overPath
        : overPath.slice(0, -1); // parent folder if dropped on file
    }
    // Prevent drop into self/descendant
    if (
      dropFolderPath.join("/") === activePath.join("/") ||
      dropFolderPath.slice(0, activePath.length).join("/") === activePath.join("/")
    ) return;

    const clonedTree = deepClone(tree);
    const [movedItem, updatedTree] = removeItem(clonedTree, activePath);
    if (!movedItem) return;
    const treeAfterInsert = insertItem(updatedTree, dropFolderPath, movedItem);
    setTree(treeAfterInsert);
  };

  return (
    <Sidebar {...props}>
      <img src="lyra-transparent.png" height={62} width={62} className="ml-3" alt="Logo" />
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
                        setIsCreatingFile(false); setNewFileName("");
                      }
                    }}
                    className="bg-transparent border-b border-muted outline-none text-inherit px-1"
                    placeholder="e.g. newfile.ts"
                    style={{ minWidth: "120px" }}
                  />
                </SidebarMenuButton>
              )}
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
                        setIsCreatingFolder(false); setNewFolderName("");
                      }
                    }}
                    className="bg-transparent border-b border-muted outline-none text-inherit px-1"
                    placeholder="e.g. newfolder"
                    style={{ minWidth: "120px" }}
                  />
                </SidebarMenuButton>
              )}
              <DndContext onDragEnd={handleDragEnd}>
                {tree.map((item, idx) => (
                  <Tree
                    key={idx}
                    item={item}
                    openFile={openFile}
                    activeFile={activeFile}
                    parentPath=""
                  />
                ))}
                {/* Allow dropping at root */}
                <RootDropOverlay />
              </DndContext>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

// Root dropping area for moving items to root
function RootDropOverlay() {
  const { setNodeRef, isOver } = useDroppable({ id: "" });
  return <div ref={setNodeRef} style={{
    height: 10,
    background: isOver ? "#bae6fd" : undefined,
  }} />;
}

// The recursive file/folder tree node renderer with drag/drop
function Tree({
  item,
  openFile,
  activeFile,
  parentPath = "",
}: {
  item: TreeNode;
  openFile: (filePath: string) => void;
  activeFile: string;
  parentPath?: string;
}) {
  const isFile = typeof item === "string";
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const path = getNodeId(name, parentPath);
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({ id: path });
  const { setNodeRef: setDropRef, isOver } = useDroppable({ id: path });

  if (isFile) {
  return (
    <div
      ref={setDropRef} // Only droppable, not draggable
      style={{
        background: isOver ? "#dbeafe" : undefined,
      }}
    >
      <SidebarMenuButton
        isActive={path === activeFile}
        onClick={() => openFile(path)}
        className="data-[active=true]:bg-transparent flex items-center"
      >
        <div
          ref={setDragRef} // Draggable handle
          {...listeners} {...attributes}
          style={{
            opacity: isDragging ? 0.3 : 1,
            cursor: "grab",
            padding: "0 4px",
          }}
        >
          <File size={16} />
        </div>
        {name}
      </SidebarMenuButton>
    </div>
  );
}

  return (
    <div
      ref={node => { setDragRef(node); setDropRef(node); }}
      style={{
        opacity: isDragging ? 0.3 : 1,
        background: isOver ? "#dbeafe" : undefined,
      }}
    >
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
              {items.map((subItem, i) => (
                <Tree
                  key={i}
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
    </div>
  );
}
