import Brick from "@/components/Brick";

export default function NotFound() {
  return (
    <div>
      <div
        className="absolute font-bold text-lg w-full top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2 text-neutral-600 text-center"
      >
        <div className=" pointer-events-none">페이지를 찾을 수 없습니다.<br /></div>
        <a href="/" className="hover:underline text-blue-600">메인 페이지로 돌아가기</a>
      </div>
      <Brick />
    </div>
  )
}
