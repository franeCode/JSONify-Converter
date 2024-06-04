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
  const [message, setMessage] = useState<string | ''>('');
  const [error, setError] = useState<string | ''>('' as string);

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
      // https://jsonify-converter.onrender.com/convert'
      try {
        const response = await axios.post('https://jsonify-converter.onrender.com/convert', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        setTimeout(() => {
          setJsonData(response.data.data);
          setConverting(false);
          setConverted(true);
          setMessage('File is converted successfully!');
        }, 3000);

      } catch (error) {
        setError('Error converting file, please check the file and try again.');
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

        setMessage('File downloaded successfully!');
      } catch (error) {
        setError('Error downloading JSON data');
        setMessage('Error downloading JSON data');
      }
    }
  };

  const handleCopy = () => {
    if (jsonData) {
      navigator.clipboard.writeText(jsonData)
        .then(() => {
          setMessage("JSON data copied to clipboard!");
        })
        .catch(() => {
          setError("Error copying JSON data to clipboard");
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

  const reset = () => {
    setFile(null);
    setJsonData(null);
    setConverted(false);
    setOpen(false);
    setMessage('');
    setError('');
  }

  return (
    <>
      <div className='w-screen bg-[#FCFCF9] h-screen overflow-auto flex flex-col py-12 relative'>
        <div className='w-full h-[6rem] bg-[#FCFCF9] lg:bg-transparent z-10 fixed top-0 left-8'>
          <img className='w-[3rem] md:w-[4rem] mt-4' src={logo} alt="logo" />
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
          message={message}
          reset={reset}
          error={error}
        />
        <Footer />
      </div>
    </>
  )
}

export default App;
