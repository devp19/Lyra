"use client";

import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CodeXml, MoreHorizontal, Check } from "lucide-react";

const repositories = [
  {
    id: 1,
    name: "lyra-platform",
    visibility: "Private",
    lastCommit: "2025-08-05",
    status: "In Process",
    reviewer: "Jamik Tashpulatov",
    size: "452 KB",
    url: "https://github.com/lyra-platform",
  },
  {
    id: 2,
    name: "agentic-sandbox",
    visibility: "Public",
    lastCommit: "2025-08-03",
    status: "Done",
    reviewer: "Eddie Lake",
    size: "1.2 MB",
    url: "https://github.com/agentic-sandbox",
  },
  {
    id: 3,
    name: "draw2model",
    visibility: "Public",
    lastCommit: "2025-08-01",
    status: "In Review",
    reviewer: "Assign reviewer",
    size: "977 KB",
    url: "https://github.com/draw2model",
  },
];

const allColumns = [
  { key: "name", label: "Name" }, // Always visible
  { key: "visibility", label: "Visibility" },
  { key: "lastCommit", label: "Last Commit" },
  { key: "size", label: "Size (KB/MB)" },
  { key: "url", label: "Repository URL" },
];

const customizableColumns = allColumns.filter((col) => col.key !== "name");

export default function RepositoryTable() {
  // Always show "name" column
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    allColumns.map((col) => col.key)
  );

  // Toggle column visibility, except for "name" (cannot be hidden)
  const toggleColumn = (key: string) => {
    if (key === "name") return;
    setVisibleColumns((cols) =>
      cols.includes(key) ? cols.filter((col) => col !== key) : [...cols, key]
    );
  };

  return (
    <div className="bg-muted/50 rounded-xl p-6 text-sm flex flex-col min-h-[60vh] w-full shadow-md">
      <div className="mb-4 flex items-center justify-between">
        <div className="font-regular text-lg text-foreground">
          Your Repositories
        </div>
        <div>
          <Select>
            <SelectTrigger className="w-[180px] border-none">
              Customize Columns
            </SelectTrigger>
            <SelectContent>
              {customizableColumns.map((col) => (
                <div
                  key={col.key}
                  className="flex items-center justify-between px-2 py-1 hover:bg-muted/30 rounded"
                  onClick={() => toggleColumn(col.key)}
                >
                  <span
                    className="cursor-default font-regular"
                    style={{ fontSize: "15px" }}
                  >
                    {col.label}
                  </span>
                  {visibleColumns.includes(col.key) && (
                    <Check size={16} className="text-primary" />
                  )}
                </div>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {/* NAME column always rendered */}
            <TableCell key="name">
              {allColumns.find((c) => c.key === "name")!.label}
            </TableCell>
            {customizableColumns.map((col) =>
              visibleColumns.includes(col.key) ? (
                <TableCell key={col.key}>{col.label}</TableCell>
              ) : null
            )}
            <TableCell className="w-8" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {repositories.map((repo) => (
            <TableRow key={repo.id} className="hover:bg-muted/100 odd:bg-muted/60">
              <TableCell className="font-medium text-foreground">
                {repo.name}
              </TableCell>
              {visibleColumns.includes("visibility") && (
                <TableCell>
                  <Badge
                    variant={
                      repo.visibility === "Public" ? "default" : "secondary"
                    }
                  >
                    {repo.visibility}
                  </Badge>
                </TableCell>
              )}
              {visibleColumns.includes("lastCommit") && (
                <TableCell>{repo.lastCommit}</TableCell>
              )}
              {visibleColumns.includes("size") && (
                <TableCell>{repo.size}</TableCell>
              )}
              {visibleColumns.includes("url") && (
                <TableCell>
                  <a
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {repo.url}
                  </a>
                </TableCell>
              )}
              <TableCell>
                <Button className="inline-flex items-center gap-1 border p-2 rounded-md">
                    Edit <CodeXml size={12} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
