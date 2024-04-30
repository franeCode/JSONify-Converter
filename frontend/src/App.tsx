import React, { useState } from 'react';
import axios from 'axios';
import { Header } from './components/Header';
import { Converter } from './components/Converter';
import { Footer } from './components/Footer';
import logo from './assets/img/logo.svg';

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
      <div className='w-screen bg-[#FCFCF9] h-screen overflow-auto flex flex-col py-12 relative'
        style={{
          // background: '#FCFCF9'
          // background: 'radial-gradient(circle, rgba(101, 110, 146, 1) 0%, rgba(9,93,121,1) 47%, rgba(17, 42, 70, 1) 100%)' 
        }}
      // style={{ background: 'background: linear-gradient(to left, #2F3061, #087E8B 25%, #087E8B 75%, #2F3061 100%)'}}
>
        <div>
          <img className='w-[4rem] fixed top-10 left-10' src={logo} alt="logo" />
        </div>
        <Header />
        <Converter
          converting={converting}
          jsonData={jsonData}
          converted={converted}
          file={file}
          handleFileChange={handleFileChange}
          handleConvert={handleConvert}
          handleDownload={handleDownload}
          handleCopy={handleCopy}
          handleDragOver={handleDragOver}
          handleDragEnter={handleDragEnter}
          handleDragLeave={handleDragLeave}
          handleDrop={handleDrop}
          handleFiles={handleFiles}
          dragging={dragging}
          open={open}
          showData={showData}
          />
          <Footer />
      </div>
    </>
  )
}

export default App;
