import { LuCopy } from "react-icons/lu";
import { SlCloudDownload } from "react-icons/sl";
import { CiLink } from "react-icons/ci";

type ConverterProps = {
    file: File | null;
    jsonData: string | null; 
    converting: boolean;
    converted: boolean;
    open: boolean;
    dragging: boolean; 
    handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragEnter: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
    handleDrop: (e: React.DragEvent<HTMLDivElement>) => void;
    handleFiles: (files: File[]) => void;
    showData: () => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleConvert: () => void;
    handleDownload: () => void;
    handleCopy: () => void;
};

export function Converter({ file, jsonData, converting, converted, open, dragging, handleDragOver, handleDragLeave, handleDragEnter, handleDrop, handleConvert, handleDownload, handleFileChange, handleCopy, showData }: ConverterProps) {
    return (
      <div className="pb-16">
        <div className='flex flex-col justify-center items-center relative'>
          <div className='lg:w-[50%] drop-shadow-xl rounded-md bg-gray-800 p-10'>
            <div className='flex flex-col justify-center gap-4 border border-dashed border-gray-400 rounded-md p-12'>
              <div
                className={`relative flex flex-col justify-center items-center ${dragging ? 'border ' : ''}`}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="w-full flex flex-col justify-center items-center">
                  <SlCloudDownload className='text-4xl text-[#FFFFFF]' />
                  <p className="mt-2 text-gray-200">Drag & Drop file here</p>
                  <br></br>
                  <span className="mt-2 text-gray-400 py-2">or</span>
                </div>
                <div className="relative w-full flex justify-center items-center pt-3">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <button
                    className="flex flex-row justify-center items-center gap-1 bg-gray-500 hover:bg-blue-700 text-gray-200 font-bold rounded-md cursor-pointer px-2"
                  >
                    <CiLink className='text-3xl' />
                    <span>Choose File</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full mt-4 flex flex-row justify-between">
              {file ?
                (
                  <p className="mt-2 text-gray-300">{file.name}</p>
                ) :
                (
                  <p className="mt-2 text-gray-300">No file selected</p>
                )}

              <button
                onClick={handleConvert}
                disabled={converting || converted || !file}
                className={`bg-gray-800 hover:bg-gray-700 text-[#00FF8C] font-bold py-2 px-4 rounded ${converted ? 'hidden' : ''}`}
              >
                {converting ? "Converting..." : "Convert to JSON"}
              </button>
              {jsonData && converted && (
                <button
                  onClick={handleDownload}
                  disabled={converting && !jsonData}
                  className="text-[#00FF8C] bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  Download JSON
                </button>
              )}
            </div>

            {open && jsonData && !converting && converted && (
              <div className={`mt-8 relative transition-max-height duration-300 ease-out ${open ? 'max-h-300 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-lg font-bold text-gray-300">Converted JSON:</p>
                <div className="mt-2 text-start overflow-x-auto p-4 rounded-md border border-gray-300" style={{ maxHeight: '200px' }}>
                  <pre className='text-gray-300'>
                    {jsonData}
                  </pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-10 right-0 text-gray-300 py-2 px-4 rounded bg-transparent transform border-none hover:scale-115 transition-transform duration-300"
                  >
                    <LuCopy className='text-2xl' />
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={showData}
            className='absolute -bottom-4 w-[10%] px-4 py-4 rounded-r-3xl rounded-l-3xl bg-gray-800 border-none cursor-pointer'>
            <span className='w-full block h-1 border-b-2 border-gray-500 mx-auto'></span>
            <span className='w-5/6 block h-1 border-b-2 border-gray-500 mx-auto'></span>
            <span className='w-4/6 block h-1 border-b-2 border-gray-500 mx-auto -mb-2'></span>
          </button>
        </div>
        </div>
    )
}