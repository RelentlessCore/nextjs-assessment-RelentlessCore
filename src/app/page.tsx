import Link from "next/link";

import TodoList from "./_components/TodoList";

export default async function Home() {
  return (
    <div className="h-full w-full items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <TodoList />
    </div>
  );
}
