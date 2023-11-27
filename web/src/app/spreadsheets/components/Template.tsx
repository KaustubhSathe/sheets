


export default function Template({ templateName }: { templateName: string }) {
    return (
        <div className="mt-auto mb-auto">
            <div className="w-[164px] h-[123px] flex justify-center align-middle bg-white border-gray-300 border-solid border-[1px] rounded-lg mt-auto mb-auto hover:border-[#38af75] hover:cursor-pointer">

            </div>
            <div className="ml-2 mt-2 font-semibold text-sm">{templateName}</div>
        </div>
    );
}