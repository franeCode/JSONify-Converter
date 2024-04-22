import React, { useState } from 'react';
import axios from 'axios';
import { LuCopy } from "react-icons/lu";
import { SlCloudDownload } from "react-icons/sl";
import { CiLink } from "react-icons/ci";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [converted, setConverted] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setConverted(false);
    }
  };

  const handleConvert = async () => {
    if (file) {
      setConverting(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await axios.post('http://localhost:5000/convert', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data.data);
        setTimeout(() => {
          setJsonData(response.data.data);
          setConverting(false);
          setConverted(true);
        }, 3000);

      } catch (error) {
        console.error('Error converting file:', error);
        setConverting(false);
      }
    }
  };

  const handleDownload = () => {
    if (jsonData) {
      try {
        const jsonObjects = jsonData.split('},{');

        const formattedJsonString = jsonObjects.map((obj, index) => {
          if (index === 0) {
            return obj.replace('{', '{\n  ');
          }
          else if (index === jsonObjects.length - 1) {
            return obj.replace('}', '\n}');
          }
          else {
            return obj.replace('}', '\n  }').replace('{', '{\n  ');
          }
        }).join(',\n');

        const jsonString = `[${formattedJsonString}]`;
        const jsonBlob = new Blob([jsonString], { type: 'application/json' });

        const url = window.URL.createObjectURL(jsonBlob);

        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'converted_data.json');

        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        // Handle error
      }
    }
  };

  const handleCopy = () => {
    if (jsonData) {
      navigator.clipboard.writeText(jsonData)
        .then(() => {
          alert("JSON data copied to clipboard!");
        })
        .catch((error) => {
          console.error("Error copying JSON data:", error);
        });
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = [...e.dataTransfer.files];
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    // Handle dropped files (e.g., read them or upload them)
    if (files.length > 0) {
      setFile(files[0]);
      setConverted(false);
    }
  };

  const showData = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className='w-screen h-screen flex flex-col' 
      style={{ 
              // background: 'rgb(0,212,255)'
              background: 'radial-gradient(circle, rgba(0,212,255,1) 0%, rgba(9,93,121,1) 47%, rgba(26,32,33,1) 100%)' }}
      // style={{ background: 'background: linear-gradient(to left, #2F3061, #087E8B 25%, #087E8B 75%, #2F3061 100%)'}}
      >
        <div>
          <h1 className='text-4xl text-white font-bold text-center p-16'>Transform Your CSV Data into JSON Format with Ease</h1>
        </div>
        <div className='flex flex-col justify-center items-center relative'>
          <div className='lg:w-[50%] shadow-md rounded-md bg-gray-700 p-10'>
          <div className='flex flex-col justify-center gap-4 border border-dashed border-gray-400 rounded-md p-12'>
            <div
              className={`relative flex flex-col justify-center items-center ${dragging ? 'border ' : ''}`}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="w-full flex flex-col justify-center items-center">
                <SlCloudDownload className='text-4xl' />
                <p className="mt-2 text-gray-300">Drag & Drop file here</p>
                <br></br>
                <span className="mt-2 text-gray-300">or</span>
              </div>
              <div className="relative w-full flex justify-center items-center py-2">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button
                  className="flex flex-row justify-center align-center gap-2 bg-gray-500 hover:bg-blue-700 text-gray-200 font-bold rounded-md"
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
              <p className="mt-2">{file.name}</p>
            ):
            (
              <p className="mt-2">No file selected</p>
            )}

            <button
              onClick={handleConvert}
              disabled={converting || converted || !file}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${converted ? 'hidden' : ''}`}
            >
              {converting ? "Converting..." : "Convert to JSON"}
            </button>
            {jsonData && converted && (
              <button
                onClick={handleDownload}
                disabled={converting && !jsonData}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              >
                Download JSON
              </button>
            )}
          </div>
          
          {open && jsonData && !converting && (
            <div className={`mt-8 relative overflow-hidden transition-all duration-300 ${open ? 'h-auto opacity-100' : 'h-0 opacity-0'}`}>
              <p className="text-lg font-bold">Converted JSON:</p>
              <div className="mt-2 text-start overflow-x-auto p-4 rounded-md border border-gray-300 relative" style={{ maxHeight: '300px' }}>
                <pre>
                  {jsonData}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-4 right-4 py-2 px-4 rounded bg-transparent transform border-none hover:scale-115 transition-transform duration-300"
                >
                  <LuCopy />
                </button>
              </div>
            </div>
          )}
        </div>
            <button 
              onClick={showData}
              className='absolute -bottom-4 w-[10%] px-4 py-4 rounded-r-3xl rounded-l-3xl bg-gray-700 border-none'>
              <span className='w-full block h-1 border-b-2 border-gray-500 mx-auto'></span>
              <span className='w-5/6 block h-1 border-b-2 border-gray-500 mx-auto'></span>
              <span className='w-4/6 block h-1 border-b-2 border-gray-500 mx-auto -mb-2'></span>
            </button>
        </div>
      </div>
    </>
  )
}

export default App;
