import React, { useState, useEffect } from 'react';
import axios, { CancelTokenSource } from 'axios';
import { NetworkDiagram } from '../components/NetworkDiagram.tsx';
import { Data, Link, Node } from '../test-data/data.ts';

interface UploadTextProps {
  apiUrl: string;
}

const UploadText: React.FC<UploadTextProps> = ({ apiUrl }) => {
  const [text, setText] = useState<string>('Hello this is a text for topic analysis');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [cancelTokenSource, setCancelTokenSource] = useState<CancelTokenSource | null>(null);
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    return () => {
      // Cleanup: Cancel the request if the component is unmounted
      if (cancelTokenSource) {
        cancelTokenSource.cancel('Component unmounted');
      }
    };
  }, [cancelTokenSource]);

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };

  const handleUpload = async () => {
    try {
      // Create a new CancelToken source for each request
      const source = axios.CancelToken.source();
      setCancelTokenSource(source);

      setIsUploading(true);

      console.log('upload called');
      // Perform the upload request
      const response = await axios.post(apiUrl, { text: text, document_id: 1 }, { cancelToken: source.token });

      // limit the amount of data for test purpose
      const nodes: Node[] = response.data.nodes.slice(0, 5);
      const links: Link[] = response.data.links;
      const filteredLinks: Link[] = [];
      const nodeIds = nodes.map(node => node.id);
      links.forEach(link => {
        if(nodeIds.includes(link.source +'') && nodeIds.includes(link.target + '')) {
          filteredLinks.push(link);
        }
      });


      if (response?.data) {
        setData({
          nodes,
          links: filteredLinks
        });
      }

      console.log('Upload successful:', response.data);
    } catch (error: any) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error('Error during upload:', error.message);
      }
    } finally {
      setIsUploading(false);
      setCancelTokenSource(null);
    }
  };

  const handleCancel = () => {
    // Cancel the request if it is in progress
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Request canceled by user');
    }
  };


  return (
    <div className="my-4 flex flex-col justify-center w-[700px]">
      <h1 className="text-4xl">Analyze Topics for Text</h1>
      <div className="w-full mt-6">
        <textarea
          className="resize-y rounded border p-2 w-full text-black"
          rows={7}
          placeholder="Enter text to analyze..."
          value={text}
          onChange={handleTextChange}
        />
      </div>
      <div className="w-full mt-2 flex justify-end">
        <button
          disabled={!isUploading}
          className={`mr-3 rounded bg-red-500 text-white px-4 py-2 ${!isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700'}`}
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button
          className={`rounded bg-blue-500  text-white px-4 py-2 w-36 ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          onClick={handleUpload}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>
      </div>

      <div className="mt-8">
        <h1>Node Chart with Connections</h1>
        {data && <NetworkDiagram data={data} width={1000} height={1000} />}

      </div>

    </div>
  );
};

export default UploadText;
