"use client";
import { useEffect, useRef } from "react";
import "xterm/css/xterm.css";

export function TerminalClient() {
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { Terminal } = await import("xterm");
      const { FitAddon } = await import("xterm-addon-fit");

      const terminal = new Terminal({
        theme: {
          background: "#151518",
          foreground: "#fff",
        },
        fontFamily: "JetBrains Mono, Fira Mono, monospace",
        fontSize: 14,
        cursorBlink: true,
      });

      const fitAddon = new FitAddon();
      terminal.loadAddon(fitAddon);

      terminal.open(terminalRef.current!);
      fitAddon.fit();

      // terminal.writeln("Welcome to Lyra Terminal!"); this was lowk cringe so I removed it for now
      terminal.writeln("Type any command to get started.");
      terminal.write("$ ");

      let userInput = "";

      terminal.onData((data) => {
        if (data.charCodeAt(0) === 13) {
          terminal.writeln("");
          if (userInput.trim() !== "")
            terminal.writeln(`Command not found: ${userInput}`);
          terminal.write("$ ");
          userInput = "";
        } else if (data.charCodeAt(0) === 127) {
          if (userInput.length > 0) {
            userInput = userInput.slice(0, -1);
            terminal.write("\b \b");
          }
        } else {
          userInput += data;
          terminal.write(data);
        }
      });

      const handleResize = () => fitAddon.fit();
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
        terminal.dispose();
      };
    })();
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{
        width: "100%",
        height: "100%",
        background: "#151518",
        border: "1px solid #222",
        overflow: "hidden",
        paddingLeft: "15px",
        paddingRight: "15px",
        paddingTop: "10px",
      }}
    />
  );
}
