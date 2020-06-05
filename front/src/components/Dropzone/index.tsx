import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import './styles.css';
import { FiUpload } from 'react-icons/fi';

interface FileUploaded {
  onFileUploaded: (file: File) => void
}

const Dropzone: React.FC<FileUploaded> = ({ onFileUploaded }) => {
  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0]; // Sempre vem um array de fotos;

    const fileUrl = URL.createObjectURL(file);
    onFileUploaded(file);
    setFileUploaded(fileUrl);
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*"
  })

  const [fileUploaded, setFileUploaded] = useState<string>()

  return (
    <div className="dropzone" {...getRootProps()}>
      <input accept="image/*" {...getInputProps()} />
      {
        fileUploaded
          ?  
          
          <img src={fileUploaded} alt="Imagem do estabelecimento"/>
          :

          <p>
            <FiUpload />
              Imagem do estabelecimento
            </p>

      }
    </div>
  )
}

export default Dropzone;