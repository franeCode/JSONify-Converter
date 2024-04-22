import { useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [jsonData, setJsonData] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
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
        setJsonData(response.data.data);
      } catch (error) {
        console.error('Error converting file:', error);
      } setTimeout(() => {
        setConverting(false); 
      }, 3000);
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


  return (
    <>
      <div>
      <div className='flex flex-col gap-4 border border-blue-300 rounded-md p-12'>
        {!jsonData && (
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
        )}
        {file && (
          <p className="mt-2">{file.name}</p>
        )}
        
          <button onClick={handleConvert} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          {converting ? "Converting..." : "Convert to JSON"}
          </button>
          {jsonData && (
            <button onClick={handleDownload} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Download JSON
            </button>
          )}
      </div>
      {jsonData && (
        <div className="mt-8">
        <p className="text-lg font-bold">Converted JSON:</p>
        <div className="mt-2 text-start overflow-x-auto p-4 rounded-md border border-gray-300" style={{ maxHeight: '300px' }}>
          <pre>
            {jsonData}
          </pre>
        </div>
      </div>
      
      )}
    </div>
    </>
  )
}

export default App
