import { useEffect, useState } from 'react'
import { Keys } from './helpers/key'
import { DES } from './helpers/DES'
import './App.css'
import KeyGenration from './components/KeyGenration';
import MessageGenration from './components/MessageGenration';

function App() {


  const [pt, setPt] = useState('0123456789ABCDEF');
  const [key, setKey] = useState('0123456789ABCDEF');
  const [result, setResult] = useState('');



  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const hexValue = inputValue.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    if (key.length <= 16) {
      setKey(hexValue);
    } else {
      setKey("");
    }
  };

  const handlePTChange = (e) => {
    const inputValue = e.target.value;
    const hexValue = inputValue.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
    if (pt.length <= 16) {
      setPt(hexValue);
    } else {
      setPt("");
    }
  };

  const handleKeyPress = (e) => {
    const charCode = e.charCode;
    const isHexDigit = /^[0-9a-fA-F]$/.test(String.fromCharCode(charCode));
    console.log(key.length);
    if (!isHexDigit || key.length === 16) {
      e.preventDefault();
    }
  };

  const handlePTPress = (e) => {
    const charCode = e.charCode;
    const isHexDigit = /^[0-9a-fA-F]$/.test(String.fromCharCode(charCode));
    if (!isHexDigit || pt.length === 16) {
      e.preventDefault();
    }
  };

  useEffect(() => {
    if (key.length === 16 && pt.length === 16) {
      setResult(DES(pt, Keys(key)))
    } else {
      setResult('')

    }
  }, [pt, key])
  useEffect(() => {
    if (pt.length > 16) {
      setPt('')
    }
  }, [pt])
  useEffect(() => {
    if (key.length > 16) {
      setKey('')
    }
  }, [key])

  return (
    <section className='bg-[#FFFFFF] p-5 md:mx-14 mx-5 rounded-md shadow-lg mt-20'>
      <h1 className='text-center text-3xl font-bold mb-20'>DES encryption demonstration</h1>
      <div className='flex flex-col gap-5'>
        <input defaultValue={"0123456789ABCDEF"} onKeyPress={handlePTPress} className='p-2 bg-[#DEF1FF] outline-none rounded-md w-full md:w-96 mx-auto' type="text" id='pt' onChange={(e) => handlePTChange(e)}
          placeholder='Please enter 16 hexa digits Key' />
        <input defaultValue={"0123456789ABCDEF"} onKeyPress={handleKeyPress} className='p-2 bg-[#DEF1FF] outline-none rounded-md w-full md:w-96 mx-auto' type="text" id='key' max={16} min={16} onChange={(e) => handleInputChange(e)}
          placeholder='Please enter 16 hexa digits Plaintext' />
      </div>

      <hr className='mt-10' />
      {result && <>
        <KeyGenration keyM={key} pt={pt} />
        <MessageGenration keyM={key} pt={pt} />
      </>}
    </section>
  )
}

export default App
