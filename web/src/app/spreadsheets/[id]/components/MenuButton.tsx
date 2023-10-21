export default function MenuButton({ text }: { text: string }) {
    return (
        <span className="text-center inline-block w-auto h-[24px] pr-[7px] pl-[7px] br-[1px] bl-[1px] hover:bg-slate-200 hover:cursor-pointer hover:rounded-md font-['Open_Sans']">{text}</span>
    );
}