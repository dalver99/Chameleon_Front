export default function Layout({ children }) {
  return (
    <div className="h-full p-8 flex flex-col text-center">
      <div className="mb-4 text-2xl font-bold">약관 및 면책 조항</div>
      <div className="text-start rounded border p-4 w-full text-wrap flex-1 overflow-auto text-sm whitespace-pre-wrap break-words">
        {children}
      </div>
    </div>
  );
}
