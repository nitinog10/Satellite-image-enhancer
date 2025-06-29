import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageDisplay } from './components/ImageDisplay';
import { Spinner } from './components/Spinner';
import { enhanceImage } from './services/geminiService';
import { SatelliteIcon } from './components/icons';

const App: React.FC = () => {
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnhanceClick = useCallback(async () => {
    if (!inputImage) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutputImage(null);

    try {
      // The input image is already a base64 string from the uploader
      const base64Data = inputImage.split(',')[1];
      const enhancedImageBase64 = await enhanceImage(base64Data);
      setOutputImage(`data:image/jpeg;base64,${enhancedImageBase64}`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please check the console for details.");
    } finally {
      setIsLoading(false);
    }
  }, [inputImage]);

  const handleImageSelected = (imageDataUrl: string) => {
    setInputImage(imageDataUrl);
    setOutputImage(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-brand-primary text-brand-highlight font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full max-w-7xl flex flex-col items-center gap-8 mt-8">
        <ImageUploader onImageSelected={handleImageSelected} isLoading={isLoading} />
        
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          <ImageDisplay title="Input Image" imageUrl={inputImage} />
          <ImageDisplay title="Enhanced Output">
            {isLoading && (
              <div className="absolute inset-0 bg-brand-secondary bg-opacity-70 flex flex-col justify-center items-center rounded-lg z-10">
                <Spinner />
                <p className="mt-4 text-brand-light animate-pulse">AI is enhancing the image...</p>
              </div>
            )}
            {error && !isLoading && (
              <div className="absolute inset-0 bg-red-900 bg-opacity-50 flex flex-col justify-center items-center p-4 rounded-lg text-center">
                <p className="font-bold text-red-300">Enhancement Failed</p>
                <p className="text-sm text-red-400 mt-2">{error}</p>
              </div>
            )}
            {!outputImage && !isLoading && !error && (
               <div className="flex flex-col items-center justify-center h-full text-brand-accent">
                <SatelliteIcon className="w-24 h-24" />
                <p className="mt-4 text-lg">Enhanced image will appear here</p>
              </div>
            )}
            {outputImage && <img src={outputImage} alt="Enhanced Output" className="w-full h-full object-contain rounded-lg" />}
          </ImageDisplay>
        </div>

        <div className="mt-4 w-full max-w-sm">
          <button
            onClick={handleEnhanceClick}
            disabled={!inputImage || isLoading}
            className="w-full bg-brand-cyan hover:bg-cyan-400 disabled:bg-brand-accent disabled:cursor-not-allowed text-brand-primary font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300 focus:ring-opacity-50"
          >
            {isLoading ? 'Enhancing...' : 'Enhance Image'}
          </button>
        </div>
      </main>
      <footer className="w-full text-center text-brand-accent mt-12 pb-4">
        <p>&copy; {new Date().getFullYear()} Satellite Super Resolution. AI-powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export { App };