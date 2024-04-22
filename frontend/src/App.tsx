import { useState } from 'react'
import './App.css'
import axios from 'axios';
import { LuCopy } from "react-icons/lu";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [converted, setConverted] = useState(false);

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


  return (
    <>
      <div>
        <div className='flex flex-row gap-4 border border-blue-300 rounded-md p-12'>
          <div className="relative">
            <input
              type="file"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Choose File
            </button>
          </div>
          {file && (
            <p className="mt-2">{file.name}</p>
          )}

          <button
            onClick={handleConvert}
            disabled={converting || converted}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${converted ? 'hidden' : ''}`}>
            {converting ? "Converting..." : "Convert to JSON"}
          </button>
          {jsonData && !converting && (
            <button
              onClick={handleDownload}
              disabled={converting && !jsonData}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Download JSON
            </button>
          )}
        </div>
        {jsonData && !converting && (
          <div className="mt-8 relative">
            <p className="text-lg font-bold">Converted JSON:</p>
            <div className="mt-2 text-start overflow-x-auto p-4 rounded-md border border-gray-300 relative" style={{ maxHeight: '300px' }}>
              <pre>
                {jsonData}
              </pre>
            </div>
            <button onClick={handleCopy} className="absolute top-12 right-4 py-2 px-4 rounded bg-transparent">
              <LuCopy />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default App
