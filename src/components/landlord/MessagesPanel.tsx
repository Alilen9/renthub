import React from "react";
import { Message } from "./types";

export default function MessagesPanel({ messages }: { messages: Message[] }) {
  return (
    <div className="mt-6">
      <h3 className="font-medium text-black">Messages</h3>
      <ul className="mt-3 space-y-2 max-h-40 overflow-auto">
        {messages.map((m) => (
          <li key={m.id} className="text-black border rounded p-2">
            <div className="text-black text-black">
              {m.from} • {new Date(m.time).toLocaleString()}
            </div>
            <div>{m.body}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
