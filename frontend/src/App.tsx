import { useState } from 'react'
import './App.css'
import axios from 'axios';

function App() {
  const [file, setFile] = useState<File | null>(null);
  // const [headerRows, setHeaderRows] = useState<number>(0);
  // const [footerRows, setFooterRows] = useState<number>(0);
  const [jsonData, setJsonData] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files && e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleConvert = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      // formData.append('headerRows', String(headerRows));
      // formData.append('footerRows', String(footerRows));

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


  return (
    <>
      <div>
        <div className='flex flex-col gap-4 border border-blue-300 rounded-md p-6'>
          <input 
            type="file" 
            onChange={handleFileChange}
            className="appearance-none border border-gray-300 rounded py-2 px-4 leading-tight focus:outline-none focus:border-blue-500"
            />
          <button onClick={handleConvert}>Convert to JSON</button>
          <button onClick={handleDownload} disabled={!jsonData}>Download JSON</button>
        </div>
      </div>
    </>
  )
}

export default App
